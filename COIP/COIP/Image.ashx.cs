using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;

namespace COIP
{
    /// <summary>
    /// Image 的摘要描述
    /// </summary>
    public class Image : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            System.Net.ServicePointManager.SecurityProtocol =
              System.Net.SecurityProtocolType.Ssl3 | System.Net.SecurityProtocolType.Tls |
              System.Net.SecurityProtocolType.Tls11 | System.Net.SecurityProtocolType.Tls12;

            string cctv = context.Request.Params["cctv"];
            context.Response.ContentType = "image/jpeg";
            WebClient theClient = new WebClient();
            Stream theImageStream = theClient.OpenRead(cctv);//@"http://60.249.180.86/axis-cgi/jpg/image.cgi?camera=1");

            Bitmap theBitmap = new Bitmap(theImageStream);

            theBitmap.Save(context.Response.OutputStream, System.Drawing.Imaging.ImageFormat.Jpeg);

            context.Response.Flush();
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}