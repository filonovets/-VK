import { Document, Page, Text, View, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import { Document as DocxDocument, Packer, Paragraph, TextRun, ImageRun } from 'docx';

// Регистрируем шрифт для поддержки русского языка
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf'
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto'
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  photo: {
    width: 150,
    height: 150,
    marginBottom: 15,
  }
});

export const exportToPDF = async (formData) => {
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {formData.photo && (
            <Image
              src={formData.photo}
              style={styles.photo}
            />
          )}
          <Text style={styles.heading}>{formData.fullName}</Text>
          <Text style={styles.text}>Контакты: {formData.contacts}</Text>
          <Text style={styles.text}>Образование: {formData.education}</Text>
          <Text style={styles.text}>Опыт работы: {formData.experience}</Text>
        </View>
      </Page>
    </Document>
  );

  const blob = await pdf(<MyDocument />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${formData.fullName}_resume.pdf`;
  link.click();
};

export const exportToDOCX = async (formData) => {
  // Конвертируем base64 URL в Buffer для docx
  const imageBuffer = await fetch(formData.photo)
    .then(res => res.arrayBuffer());

  const doc = new DocxDocument({
    sections: [{
      properties: {},
      children: [
        formData.photo && new Paragraph({
          children: [
            new ImageRun({
              data: imageBuffer,
              transformation: {
                width: 150,
                height: 150,
              },
            }),
          ],
        }),
        new Paragraph({
          children: [new TextRun({ text: formData.fullName, bold: true, size: 28 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: `Контакты: ${formData.contacts}`, size: 24 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: `Образование: ${formData.education}`, size: 24 })]
        }),
        new Paragraph({
          children: [new TextRun({ text: `Опыт работы: ${formData.experience}`, size: 24 })]
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${formData.fullName}_resume.docx`;
  link.click();
};