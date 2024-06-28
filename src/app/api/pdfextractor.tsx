import { NextApiRequest, NextApiResponse } from 'next';
import PDFJS from 'pdfjs-dist';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { file } = req.body; // Assuming PDF data is received in the request body

    try {
      const pdfDoc = await PDFJS.getDocument({ data: file }).promise;
      const totalPages = pdfDoc.numPages;

      const pageTextPromises = [];
      for (let i = 1; i <= totalPages; i++) {
        pageTextPromises.push(getPageText(pdfDoc, i));
      }

      const allPageText = await Promise.all(pageTextPromises);
      const extractedText = allPageText.join('\n'); // Combine text from all pages

      res.status(200).json({ extractedText });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to extract PDF text' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;

async function getPageText(pdfDoc: any, pageNumber: number) {
  const page = await pdfDoc.getPage(pageNumber);
  const tokenizedText = await page.getTextContent();
  const pageText = tokenizedText.items.map((item:any) => item.str).join('');
  return pageText;
}
