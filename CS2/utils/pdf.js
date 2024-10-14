const PDFDocument = require('pdfkit');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

function createPDF(text) {
    const uuid = uuidv4();
    const OUT_FILE = `./output/${uuid}.pdf`;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(OUT_FILE));
    doc.font('font/Roboto-Regular.ttf')
        .fontSize(14)
        .text(text, 100, 100);
    doc.end();
    return OUT_FILE;
}

module.exports = {
    createPDF
}