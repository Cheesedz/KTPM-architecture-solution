module.exports = {
    apps: [
      {
        name: 'ocrWorker',
        script: 'service/ocr_handler.js',
        instances: 1, // Or 'max' to use all available cores
        exec_mode: 'cluster', // To enable clustering
        restart_delay: 5000, // Optional: Delay between restarts in ms
      },
      {
        name: 'translateWorker',
        script: 'service/translate_handler.js',
        instances: 1, // Or 'max' to use all available cores
        exec_mode: 'cluster', // To enable clustering
        restart_delay: 5000, // Optional: Delay between restarts in ms
      },
      {
        name: 'pdfWorker',
        script: 'service/pdf_handler.js',
        instances: 1, // Or 'max' to use all available cores
        exec_mode: 'cluster', // To enable clustering
        restart_delay: 5000, // Optional: Delay between restarts in ms
      },
    ],
  };
  