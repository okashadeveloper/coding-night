// Upload single or multiple images
const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No files uploaded'
      });
    }

    // Get file paths relative to public folder
    const filePaths = req.files.map(file => `/uploads/${file.filename}`);

    res.json({
      success: true,
      data: {
        files: filePaths,
        count: filePaths.length
      },
      message: `${filePaths.length} file(s) uploaded successfully`
    });
  } catch (err) {
    console.error('Error uploading files:', err);
    res.status(500).json({
      message: 'Error uploading files: ' + err.message
    });
  }
};

module.exports = {
  uploadImages
};
