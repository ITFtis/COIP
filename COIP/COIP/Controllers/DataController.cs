using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Wordprocessing = DocumentFormat.OpenXml.Wordprocessing;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Hosting;
using System.Web;
using System.Drawing;
using DocumentFormat.OpenXml.ExtendedProperties;

namespace COIP.Controllers
{
    public class DataController : ApiController
    {
        
        [Route("api/download/docx")]
        public HttpResponseMessage DownloadWord(DocxParas paras)
        {

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            //using (WordprocessingDocument word = WordprocessingDocument.Open(exportFile, true))
            //{
            //word.t
            //var stream = new FileStream(path, FileMode.Open);
            //result.Content = new StreamContent(stream);
            result.Content = new ByteArrayContent(CreateDocxBytes(paras));
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            result.Content.Headers.ContentDisposition.FileName = paras.Name+".docx";// Path.GetFileName(path);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            //result.Content.Headers.ContentLength = stream.Length;
            return result;
            //SaveImage(img.b64, img.name);
            //return img.b64;
        }
        public  class DocxParas
        {
            public string Imageb64 { set; get; }
            public string Name { set; get; }
            public string Title { set; get; }
            public string Reason { set; get; }
            public string Attributes { set; get; }
            public string Distributed { set; get; }
            public string Issues { set; get; }
        }
       
        public static byte[] CreateDocxBytes(DocxParas paras)
        {
            var tempfile = Path.Combine(HostingEnvironment.MapPath("~/"), Guid.NewGuid() + ".docx");
            using (var ms = new MemoryStream())
            {
                
                //using (var docx = WordprocessingDocument.Open(@"D:\CVS_SRC\SourceCode\原民會\COIP\COIP\Images\1.docx", true)) //WordprocessingDocument.Create(ms, WordprocessingDocumentType.Document))
                using (var docx = WordprocessingDocument.Create(ms, WordprocessingDocumentType.Document))
                {
                    var mainPart = docx.AddMainDocumentPart();
                    //var mainPart = docx.MainDocumentPart;
                    mainPart.Document = new Document();
                    

                    var body = new Body();
                    //SectionProperties SecPro = new SectionProperties();
                    //PageSize PSize = new PageSize();
                    //PSize.Width = 15000;
                    //PSize.Height = 11000;
                    //SecPro.Append(PSize);
                    //body.Append(SecPro);

                    mainPart.Document.AppendChild(body);

                    docx.MainDocumentPart.Document.Body.Append(new Paragraph(new Run(new Text("Hello"))));

                    docx.MainDocumentPart.Document.Body.Append(AddParagraph("測試中文1", "0", "30", "標楷體", JustificationValues.Left));
                    docx.MainDocumentPart.Document.Body.Append(AddParagraph("測試中文2", "0", "20", "新細明體"));

                    ImagePart imgp = mainPart.AddImagePart(ImagePartType.Jpeg);
                    
                    MemoryStream M = new MemoryStream(Convert.FromBase64String(paras.Imageb64));
                    imgp.FeedData(M);

                    ImageData img = new ImageData(paras);

                    AddImageToBody(docx, mainPart.GetIdOfPart(imgp), img);



                    docx.Clone(tempfile).Dispose();



                    //var sectionProperties = mainPart.Document.GetFirstChild<SectionProperties>();
                    //// pageSize contains Width and Height properties
                    //var pageSize = sectionProperties.GetFirstChild<PageSize>();

                    //// this contains information about surrounding margins
                    //var pageMargin = sectionProperties.GetFirstChild<PageMargin>();

                    //// this contains information about spacing between neighbouring columns of text
                    //// this can be useful if You use page layout with multiple text columns
                    //var columns = sectionProperties.GetFirstChild<Columns>();
                    //var spaceBetweenColumns = columns.Space.Value;
                    //var columnsCount = columns.ColumnCount.Value;

                    //return ms.ToArray(); //在此直接回傳，client端的word有問題??
                }
               
            }
            var dataBytes = File.ReadAllBytes(tempfile);
                MemoryStream ms1 = new MemoryStream(dataBytes);
                File.Delete(tempfile);
            return ms1.ToArray();
        }
       

        private static Wordprocessing.Paragraph AddParagraph(string text, string firstLine="0", string fontSizeValue = "0" , string fontValue = "標楷體", JustificationValues justificationValues = JustificationValues.Left)
        {
            Wordprocessing.Paragraph paragraph = new Wordprocessing.Paragraph();
            try
            {
                var indentation = new Wordprocessing.Indentation();
                indentation.FirstLine = new DocumentFormat.OpenXml.StringValue(firstLine);
                indentation.FirstLineChars = new DocumentFormat.OpenXml.Int32Value(0);

                var justification = new Wordprocessing.Justification() { Val = justificationValues };

                var fontSize = new Wordprocessing.FontSize() { Val = new DocumentFormat.OpenXml.StringValue(fontSizeValue) };
                var runFont = new Wordprocessing.RunFonts() { Ascii = fontValue };

                var paragraphProperties = new Wordprocessing.ParagraphProperties();
                paragraphProperties.Append(indentation);
                paragraphProperties.Append(justification);

                var runProperties = new Wordprocessing.RunProperties();
                runProperties.Append(fontSize);
                runProperties.Append(runFont);

                var run = new Wordprocessing.Run(new Wordprocessing.Text(text));
                run.PrependChild(runProperties);

                paragraph.Append(paragraphProperties);
                paragraph.Append(run);
            }
            catch (Exception)
            {
            }
            return paragraph;
        }
        //public static void InsertAPicture(string document, string fileName)
        //{
        //    using (WordprocessingDocument wordprocessingDocument =
        //        WordprocessingDocument.Open(document, true))
        //    {
        //        MainDocumentPart mainPart = wordprocessingDocument.MainDocumentPart;

        //        ImagePart imagePart = mainPart.AddImagePart(ImagePartType.Jpeg);

        //        using (FileStream stream = new FileStream(fileName, FileMode.Open))
        //        {
        //            imagePart.FeedData(stream);
        //        }

        //        AddImageToBody(wordprocessingDocument, mainPart.GetIdOfPart(imagePart));
        //    }
        //}

        private static void AddImageToBody(WordprocessingDocument wordDoc, string relationshipId, ImageData img)
        {
            var maxw = 5250000U;
            var displayw = 4800000U;

            var w = img.WidthInEMU> displayw ? displayw : img.WidthInEMU;

            var h = w*img.HeightInEMU / img.WidthInEMU;

            var l = (maxw - w) / 2;
            // Define the reference of the image.
            // Define the reference of the image.

            var element =
                 new Drawing(
                     new DW.Inline(
                         //Size of image, unit = EMU(English Metric Unit)
                         //1 cm = 360000 EMUs
                         //new DW.Extent() { Cx = img.WidthInEMU, Cy = img.HeightInEMU },
                         new DW.Extent() { Cx = w, Cy = h },
                         new DW.EffectExtent()
                         {
                             LeftEdge = l,
                             TopEdge = 0L,
                             RightEdge = 0L,
                             BottomEdge = 0L
                         },
                         new DW.DocProperties()
                         {
                             Id = (UInt32Value)1U,
                             Name = img.ImageName
                         },
                         new DW.NonVisualGraphicFrameDrawingProperties(
                             new A.GraphicFrameLocks() { NoChangeAspect = true }),
                         new A.Graphic(
                             new A.GraphicData(
                                 new PIC.Picture(
                                     new PIC.NonVisualPictureProperties(
                                         new PIC.NonVisualDrawingProperties()
                                         {
                                             Id = (UInt32Value)0U,
                                             Name = img.FileName
                                         },
                                         new PIC.NonVisualPictureDrawingProperties()),
                                     new PIC.BlipFill(
                                         new A.Blip(
                                             new A.BlipExtensionList(
                                                 new A.BlipExtension()
                                                 {
                                                     Uri =
                                                        "{28A0092B-C50C-407E-A947-70E740481C1C}"
                                                 })
                                         )
                                         {
                                             Embed = relationshipId,
                                             CompressionState =
                                             A.BlipCompressionValues.Print
                                         },
                                         new A.Stretch(
                                             new A.FillRectangle())),
                                     new PIC.ShapeProperties(
                                         new A.Transform2D(
                                             new A.Offset() { X = 0L, Y = 0L },
                                             new A.Extents()
                                             {
                                                 Cx = img.WidthInEMU,
                                                 Cy = img.HeightInEMU
                                             }),
                                         new A.PresetGeometry(
                                             new A.AdjustValueList()
                                         )
                                         { Preset = A.ShapeTypeValues.Rectangle }))
                             )
                             { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" })
                     )
                     {
                         DistanceFromTop = (UInt32Value)0U,
                         DistanceFromBottom = (UInt32Value)0U,
                         DistanceFromLeft = (UInt32Value)0U,
                         DistanceFromRight = (UInt32Value)0U,
                         EditId = "50D07946"
                     });
            //return new Run(element);
            var p = new Paragraph(new Run(element));
            //var justification = new Wordprocessing.Justification() { Val = JustificationValues.Center };
            //var paragraphProperties = new Wordprocessing.ParagraphProperties();
            //paragraphProperties.Append(justification);
            //p.Append(paragraphProperties);

            wordDoc.MainDocumentPart.Document.Body.AppendChild(p);
            //wordDoc.MainDocumentPart.Document.Body.AppendChild(new Paragraph(new Run(element)));
            //wordDoc.MainDocumentPart.Document.Body.AppendChild(p);
        }

        public class ImageData
        {
            public string FileName = string.Empty;
            public byte[] BinaryData;
            public Stream DataStream => new MemoryStream(BinaryData);
            public ImagePartType ImageType
            {
                get
                {
                    var ext = Path.GetExtension(FileName).TrimStart('.').ToLower();
                    switch (ext)
                    {
                        case "jpg":
                            return ImagePartType.Jpeg;
                        case "png":
                            return ImagePartType.Png;
                        case "":
                            return ImagePartType.Gif;
                        case "bmp":
                            return ImagePartType.Bmp;
                    }
                    throw new ApplicationException($"Unsupported image type: {ext}");
                }
            }
            public int SourceWidth;
            public int SourceHeight;
            public decimal Width;
            public decimal Height;
            public long WidthInEMU => Convert.ToInt64(Width * CM_TO_EMU);
            public long HeightInEMU => Convert.ToInt64(Height * CM_TO_EMU);
            private const decimal INCH_TO_CM = 2.54M;
            private const decimal CM_TO_EMU = 360000M;
            public string ImageName;
            public ImageData(DocxParas paras , int dpi = 300)
            {
                Bitmap img = Base64StringToImage(paras.Imageb64) as Bitmap;
                SourceWidth = img.Width;
                SourceHeight = img.Height;
                Width = ((decimal)SourceWidth) / dpi * INCH_TO_CM;
                Height = ((decimal)SourceHeight) / dpi * INCH_TO_CM;
                ImageName = $"IMG_{Guid.NewGuid().ToString().Substring(0, 8)}";
                FileName = paras.Name;
            }
            public ImageData(string fileName, byte[] data, int dpi = 300)
            {
                FileName = fileName;
                BinaryData = data;
                Bitmap img = new Bitmap(new MemoryStream(data));
                SourceWidth = img.Width;
                SourceHeight = img.Height;
                Width = ((decimal)SourceWidth) / dpi * INCH_TO_CM;
                Height = ((decimal)SourceHeight) / dpi * INCH_TO_CM;
                ImageName = $"IMG_{Guid.NewGuid().ToString().Substring(0, 8)}";
            }
            //public ImageData(string fileName, int dpi = 300) :
            //    this(fileName, File.ReadAllBytes(fileName), dpi)
            //{
            //}
        }

        /// <summary>
        /// base 64字串格式的圖片轉成Image物件
        /// </summary>
        /// <param name="base64String"></param>
        /// <returns></returns>
        public static System.Drawing.Image Base64StringToImage(string base64String)
        {
            // Convert base 64 string to byte[]
            byte[] Buffer = Convert.FromBase64String(base64String);

            byte[] data = null;
            System.Drawing.Image oImage = null;
            MemoryStream oMemoryStream = null;
            Bitmap oBitmap = null;
            //建立副本
            data = (byte[])Buffer.Clone();
            try
            {
                oMemoryStream = new MemoryStream(data);
                //設定資料流位置
                oMemoryStream.Position = 0;
                oImage = System.Drawing.Image.FromStream(oMemoryStream);
                //建立副本
                oBitmap = new Bitmap(oImage);
            }
            catch
            {
                throw;
            }
            finally
            {
                oMemoryStream.Close();
                oMemoryStream.Dispose();
                oMemoryStream = null;
            }
            //return oImage;
            return oBitmap;
        }
        public string ImageToBase64(System.Drawing.Image image, System.Drawing.Imaging.ImageFormat format)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                // Convert Image to byte[]
                image.Save(ms, format);
                byte[] imageBytes = ms.ToArray();

                // Convert byte[] to base 64 string
                string base64String = Convert.ToBase64String(imageBytes);
                return base64String;
            }
        }
    }
}