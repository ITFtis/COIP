using iTextSharp.text;
using iTextSharp.text.pdf;
using Org.BouncyCastle.Asn1.Cms;
using System;
using System.CodeDom;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using static COIP.Controllers.DataController;

namespace COIP.Controllers
{
    public class DownloadController : ApiController
    {
        [Route("api/download/pdf")]
        public HttpResponseMessage DownloadPdf(DocxParas paras)
        {
            var fn = paras.Name + ".pdf";
            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new ByteArrayContent(CreatePdfBytes(paras));
            result.Content.Headers.ContentType = new MediaTypeHeaderValue(MimeMapping.GetMimeMapping(fn));
            //result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment") { FileName = fn };
            return result;
        }
        //設定中文字體
        static string chKaiuFontPath = "c:\\windows\\fonts\\KAIU.TTF";//windows內建的標楷體
        static string chSimheiFontPath = "c:\\windows\\fonts\\simhei.ttf";//windows內建的中易黑體                            
        static string chMingliu0FontPath = "c:\\windows\\fonts\\mingliu.ttc,0";//windows內建的細明體                            
        static string chMingliu1FontPath = "c:\\windows\\fonts\\mingliu.ttc,1";//windows內建的新細明體   
        static string chMsjhFontPath = "c:\\windows\\fonts\\msjh.ttc,0";//微軟正黑體（需另外安裝）
        static string chMsjhbdFontPath = "c:\\windows\\fonts\\msjhbd.ttc,0";//微軟正黑體粗體（需另外安裝）
        public byte[] CreatePdfBytes(DocxParas paras)
        {
            var currentFontPath = chKaiuFontPath;
            BaseFont bfChinese = iTextSharp.text.pdf.BaseFont.CreateFont(currentFontPath, BaseFont.IDENTITY_H, BaseFont.NOT_EMBEDDED);
            iTextSharp.text.Font fontChinese = new iTextSharp.text.Font(bfChinese, 12, iTextSharp.text.Font.NORMAL, new BaseColor(0, 0, 0));
            iTextSharp.text.Font fontBlodChinese = new iTextSharp.text.Font(bfChinese, 12, iTextSharp.text.Font.BOLD, new BaseColor(0, 0, 0));
            iTextSharp.text.Font fontTitleBlodChinese = new iTextSharp.text.Font(bfChinese, 16, iTextSharp.text.Font.BOLD, new BaseColor(0, 0, 0));

            string file = Guid.NewGuid().ToString() + ".pdf";
            string dp = System.Web.Hosting.HostingEnvironment.MapPath("~/pdf");
            if (!Directory.Exists(dp))
                Directory.CreateDirectory(dp);
            string filePath = Path.Combine(dp, file);
            Document document = new Document();
            PdfWriter writer = PdfWriter.GetInstance(document, new FileStream(filePath, FileMode.Create));
            document.Open();

            //iTextSharp.text.Header h = new Header(paras.c2, "HEADER");
            //document.Add(h);

            float contentIndentationLeft = 24f;
            float multipliedLeading = 1.6f;
            float spacingAfter = 5f;

            var _title = new Paragraph( paras.Title, fontTitleBlodChinese);
            _title.Alignment = Element.ALIGN_CENTER;
            _title.SpacingAfter = spacingAfter * 2;
            document.Add(_title);

           
            //一、緣由
            document.Add(new Paragraph("一、緣由", fontBlodChinese));
            if (!string.IsNullOrEmpty(paras.Reason))
            {
                var reasons = paras.Reason.Split(new string[] { System.Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var r in reasons)
                {
                    Paragraph reasonpg = new Paragraph(r, fontChinese);
                    //reasonpg.SetAlignment("Justify"); //左右對齊
                    reasonpg.Alignment = Element.ALIGN_JUSTIFIED;
                    reasonpg.FirstLineIndent = contentIndentationLeft;   //段落句首縮排
                    reasonpg.IndentationLeft = contentIndentationLeft;
                    reasonpg.SetLeading(0.0f, multipliedLeading);  //設定行距
                    reasonpg.SpacingAfter = spacingAfter;
                    document.Add(reasonpg);
                }
            }

            //插圖
            Byte[] imageBytes = Convert.FromBase64String(paras.Imageb64);
            iTextSharp.text.Image image = iTextSharp.text.Image.GetInstance(imageBytes);
            //iTextSharp.text.Image jpeg03 = iTextSharp.text.Image.GetInstance((@"D:\CVS_SRC\SourceCode\十河局\Wra10Cia5\Wra10Cia5\images\page\分洪進水口位置圖.jpg");
            //image.SetAbsolutePosition(0, 0);
            //image.ScaleAbsoluteHeight(document.PageSize.Height);
            //image.ScaleAbsoluteWidth(document.PageSize.Width);
            ScaleImageToWidth(document, image, 95);
            image.Alignment = Element.ALIGN_RIGHT;
            //image.IndentationLeft = contentIndentationLeft;
            document.Add(image);
            var _imagedesc = new Paragraph("圖1 本案地理位置分布圖", fontChinese);
            _imagedesc.Alignment= Element.ALIGN_CENTER;
            _imagedesc.SpacingAfter = spacingAfter;
            document.Add(_imagedesc);
            
            //二、用地屬性
            document.Add(new Paragraph("二、用地屬性", fontBlodChinese));
            if (!string.IsNullOrEmpty(paras.Attributes))
            {
                var attributes = paras.Attributes.Split(new string[] { System.Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var attr in attributes)
                {
                    Paragraph attributespg = new Paragraph(attr, fontChinese);
                    attributespg.Alignment = Element.ALIGN_JUSTIFIED;
                    attributespg.FirstLineIndent = contentIndentationLeft;   //段落句首縮排
                    attributespg.IndentationLeft = contentIndentationLeft;
                    attributespg.SetLeading(0.0f, multipliedLeading);  //設定行距
                    attributespg.SpacingAfter = spacingAfter;
                    document.Add(attributespg);
                }
            }
            //三、災害潛勢及地質分布
            document.Add(new Paragraph("三、災害潛勢及地質分布", fontBlodChinese));
            if (!string.IsNullOrEmpty(paras.Distributed))
            {
                var distributeds = paras.Distributed.Split(new string[] { System.Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var d in distributeds)
                {
                    Paragraph distributedpg = new Paragraph(d, fontChinese);
                    distributedpg.Alignment = Element.ALIGN_JUSTIFIED;
                    distributedpg.FirstLineIndent = contentIndentationLeft;   //段落句首縮排
                    distributedpg.IndentationLeft = contentIndentationLeft;
                    distributedpg.SetLeading(0.0f, multipliedLeading);  //設定行距
                    distributedpg.SpacingAfter = spacingAfter;
                    document.Add(distributedpg);
                }
            }

            //四、關鍵課題說明
            document.Add(new Paragraph("四、關鍵課題說明", fontBlodChinese));
            if (!string.IsNullOrEmpty(paras.Issues))
            {
                var issues = paras.Issues.Split(new string[] { System.Environment.NewLine }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var iss in issues)
                {
                    Paragraph issuespg = new Paragraph(iss, fontChinese);
                    issuespg.Alignment = Element.ALIGN_JUSTIFIED;
                    //issuespg.FirstLineIndent = -contentIndentationLeft;   //段落句首縮排
                    issuespg.IndentationLeft = contentIndentationLeft;// * 2;
                    //issuespg.SpacingAfter = contentIndentationLeft;
                    issuespg.SetLeading(0.0f, multipliedLeading);  //設定行距
                    issuespg.SpacingAfter = spacingAfter;
                    document.Add(issuespg);
                }
            }
           

            document.Close();
            writer.Close();    // NEW!!
            byte[] bytes = File.ReadAllBytes(filePath);
            File.Delete(filePath);
            return bytes;
        }

        void ScaleImageToWidth(Document document, iTextSharp.text.Image image, int fullPagePercent = 100)
        {
            var scale = (document.PageSize.Width / image.Width);
            //image.Width = image.Width * scale*(fullPagePercent/100f);
            //image.Height = image.Height * scale * (fullPagePercent / 100f);
            //image.ScaleAbsoluteHeight(image.Height * scale * (fullPagePercent / 100f));
            //image.ScaleAbsoluteWidth(image.Width * scale * (fullPagePercent / 100f));
            var contentwidth = document.PageSize.Width - document.LeftMargin - document.RightMargin;
            var scalePercent = (contentwidth / image.Width) * fullPagePercent;
            image.ScalePercent(scalePercent);
            //img.ScalePercent(scale);
        }
    }
}