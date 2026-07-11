import React, { createContext, useContext, useMemo, useState } from 'react';
import {
  DEMO_ASSETS,
  DEMO_ISSUES,
  DEFAULT_SCHEDULED_MAINTENANCE,
  DEFAULT_TECHNICIANS,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_SETTINGS_PREFS
} from '../data/demoWorkspace';

/** Default KPI counts for the AssetCare workspace (Phase 2 seed state) */
export const DEFAULT_WORKSPACE_STATS = {
  totalAssets: 8,
  operationalAssets: 4,
  assetsUnderMaintenance: 2,
  openIssues: 8,
  overdueMaintenance: 1,
  resolvedThisMonth: 0
};

/** Technician dashboard seed KPIs */
export const DEFAULT_TECHNICIAN_KPIS = {
  assignedIssues: 4,
  highPriority: 0,
  dueToday: 0,
  inProgress: 0,
  priorityMix: { low: 2, medium: 2, high: 0, critical: 0 }
};

const initialsFrom = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase() || 'U';

const WorkspaceContext = createContext(null);

export const WorkspaceProvider = ({ children, sessionUser = null }) => {
  const isAdmin = sessionUser?.role === 'admin';

  const profile = useMemo(() => {
    if (isAdmin) {
      return {
        name: sessionUser?.name || 'Alen Malkoč',
        title: 'Administrator',
        initials: initialsFrom(sessionUser?.name || 'Alen Malkoč'),
        email: sessionUser?.email || 'admin@assetcare.demo'
      };
    }
    return {
      name: sessionUser?.name || 'Ahmed Raza',
      title: 'Senior Maintenance Technician',
      initials: initialsFrom(sessionUser?.name || 'Ahmed Raza'),
      email: sessionUser?.email || 'technician@assetcare.demo'
    };
  }, [isAdmin, sessionUser]);

  const account = useMemo(
    () => ({
      name: profile.name,
      email: profile.email,
      role: profile.title,
      campus: 'SMIT Technology Campus'
    }),
    [profile]
  );

  const [stats, setStats] = useState(DEFAULT_WORKSPACE_STATS);
  const [technicianKpis, setTechnicianKpis] = useState(DEFAULT_TECHNICIAN_KPIS);
  const [assets, setAssets] = useState(DEMO_ASSETS);
  const [issues, setIssues] = useState(DEMO_ISSUES);
  const [scheduledMaintenance, setScheduledMaintenance] = useState(
    DEFAULT_SCHEDULED_MAINTENANCE
  );
  const [technicians, setTechnicians] = useState(DEFAULT_TECHNICIANS);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [settingsPrefs, setSettingsPrefs] = useState(DEFAULT_SETTINGS_PREFS);

  const addAsset = (payload) => {
    const id = `a${Date.now()}`;
    const code =
      payload.code ||
      `${(payload.category || 'AST').slice(0, 3).toUpperCase()}-${id.slice(-4)}`;
    const next = {
      id,
      name: payload.name,
      code,
      category: payload.category,
      location: payload.location,
      condition: payload.condition || 'Good',
      status: 'Operational',
      lastService: '—',
      nextService: payload.nextService || 'TBD',
      openIssues: 0,
      actions: ['Open', 'QR'],
      manufacturer: payload.manufacturer || '—',
      serialNumber: payload.serialNumber || '—',
      notes: payload.notes || 'Registered by administrator.'
    };
    setAssets((prev) => [next, ...prev]);
    setStats((prev) => ({
      ...prev,
      totalAssets: prev.totalAssets + 1,
      operationalAssets: prev.operationalAssets + 1
    }));
    return next;
  };

  const deleteAsset = (id) => {
    setAssets((prev) => {
      const target = prev.find((a) => a.id === id);
      if (!target) return prev;
      setStats((s) => ({
        ...s,
        totalAssets: Math.max(0, s.totalAssets - 1),
        operationalAssets:
          target.status === 'Operational'
            ? Math.max(0, s.operationalAssets - 1)
            : s.operationalAssets,
        assetsUnderMaintenance:
          target.status === 'Under Maintenance'
            ? Math.max(0, s.assetsUnderMaintenance - 1)
            : s.assetsUnderMaintenance
      }));
      return prev.filter((a) => a.id !== id);
    });
  };

  const updateAsset = (id, patch) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = { ...a, ...patch };
        if (patch.status && patch.status !== a.status) {
          setStats((s) => {
            let operationalAssets = s.operationalAssets;
            let assetsUnderMaintenance = s.assetsUnderMaintenance;
            if (a.status === 'Operational') operationalAssets = Math.max(0, operationalAssets - 1);
            if (a.status === 'Under Maintenance') {
              assetsUnderMaintenance = Math.max(0, assetsUnderMaintenance - 1);
            }
            if (next.status === 'Operational') operationalAssets += 1;
            if (next.status === 'Under Maintenance') assetsUnderMaintenance += 1;
            return { ...s, operationalAssets, assetsUnderMaintenance };
          });
        }
        return next;
      })
    );
  };

  const assignIssue = (id, technicianName) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id
          ? {
              ...issue,
              assignedTechnician: technicianName,
              status: 'Assigned',
              lastUpdated: 'Just now'
            }
          : issue
      )
    );
  };

  const updateIssue = (id, patch) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === id ? { ...issue, ...patch } : issue))
    );
  };

  const addScheduledRoutine = (payload) => {
    const next = {
      id: `sm${Date.now()}`,
      assetName: payload.assetName,
      assetCode: payload.assetCode || '—',
      task: payload.task,
      assignedTo: payload.assignedTo,
      dueDate: payload.dueDate,
      priority: payload.priority || 'Medium',
      status: payload.status || 'Scheduled'
    };
    setScheduledMaintenance((prev) => [next, ...prev]);
    return next;
  };

  const updateScheduleItem = (id, patch) => {
    setScheduledMaintenance((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const updateTechnician = (id, patch) => {
    setTechnicians((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleSetting = (key) => {
    setSettingsPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const value = useMemo(
    () => ({
      isAdmin,
      sessionUser,
      stats,
      setStats,
      technicianKpis,
      setTechnicianKpis,
      profile,
      account,
      workplace: {
        name: 'SMIT Technology Campus',
        description:
          'Every physical asset deserves a complete digital maintenance history.'
      },
      assets,
      setAssets,
      addAsset,
      deleteAsset,
      updateAsset,
      issues,
      setIssues,
      assignIssue,
      updateIssue,
      scheduledMaintenance,
      setScheduledMaintenance,
      addScheduledRoutine,
      updateScheduleItem,
      technicians,
      setTechnicians,
      updateTechnician,
      notifications,
      setNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      settingsPrefs,
      setSettingsPrefs,
      toggleSetting
    }),
    [
      isAdmin,
      sessionUser,
      stats,
      technicianKpis,
      profile,
      account,
      assets,
      issues,
      scheduledMaintenance,
      technicians,
      notifications,
      settingsPrefs
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return ctx;
};

export default WorkspaceContext;
