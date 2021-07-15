---
title: 'WebApi调用'
date: 2021-03-30
categories:
- "Csharp"
tags:
- WebApiRequest
sidebar: true
permalink: '/Tools/HttpRequest'
isFull: false
isShowComments: true
isShowIndex: false
---

## 前端JQuery调用

```js
<script src="~/Scripts/jquery-3.4.1.js"></script>
<script>
    $(function () {
        var user = { UserId: "11", UserName: "xxx", UserEmail: "2222222@qq.com" };
        var info = "this is muti model";
        $("#btnGet1").on("click", function () {
            //$.ajax({ url: "/api/users", type: "get", data: { "userName": "Superman" }, success: function (data) { alert(data); }, datatype: "json" });//指向接口，参数匹配的，大小写不区分
            $.ajax({
                url: "/api/users/GetUserByName", type: "get", data: { "username": "Superman" },
                beforeSend: function (XHR) {
                    //发送ajax请求之前向http的head里面加入验证信息
                    XHR.setRequestHeader('Authorization', 'BasicAuth ' + ticket);
                },
                success: function (data) {
                    alert(data);
                }, datatype: "json"
            });
        });
        $("#btnGet2").on("click", function () {//单个参数
            $.ajax({ url: "/api/users/GetUserByID", type: "get", data: { "id": $("#txtId").val() }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnGet3").on("click", function () {//两个参数
            $.ajax({ url: "/api/users/GetUserByNameId", type: "get", data: { "userName": "Superman", "id": $("#txtId").val() }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnGet4").on("click", function () {//无参数
            $.ajax({ url: "/api/users/Get", type: "get", data: "", success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnGet5").on("click", function () {//传递实体 json对象
            $.ajax({ url: "/api/users/GetUserByModel", type: "get", data: user, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnGet6").on("click", function () {//传递实体  必须FromUri才能找到
            $.ajax({ url: "/api/users/GetUserByModelUri", type: "get", data: user, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnGet7").on("click", function () {//传递实体,序列化后传递
            $.ajax({ url: "/api/users/GetUserByModelSerialize", type: "get", data: { userString: JSON.stringify(user) }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnGet8").on("click", function () {//传递实体,序列化后传递
            $.ajax({ url: "/api/users/GetUserByModelSerializeWithoutGet", type: "get", data: { userString: JSON.stringify(user) }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnGet9").on("click", function () {//传递实体,序列化后传递  405 Method Not Allowed    不带httpget需要用get开头
            $.ajax({ url: "/api/users/NoGetUserByModelSerializeWithoutGet", type: "get", data: { userString: JSON.stringify(user) }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPost1").on("click", function () {//单个值传递，json数据不要key，这样后台才能获取
            $.ajax({ url: "/api/users/RegisterNoKey", type: "post", data: { "": $("#txtId").val() }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPost2").on("click", function () {//key-value形式后台拿不到这个参数，但是可以直接访问
            $.ajax({ url: "/api/users/Register", type: "post", data: { "id": $("#txtId").val() }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPost3").on("click", function () {//传递json格式的，后台可以用实体接收
            $.ajax({ url: "/api/users/RegisterUser", type: "post", data: user, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPost4").on("click", function () {//传递json序列化后的格式，后台可以用实体接收,需要指定contentType
            $.ajax({ url: "/api/users/RegisterUser", type: "post", data: JSON.stringify(user), success: function (data) { alert(data); }, datatype: "json", contentType: 'application/json', });
        });
        $("#btnPost5").on("click", function () {//JObject接收
            $.ajax({ url: "/api/users/RegisterObject", type: "post", data: { "User": user, "Info": info }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPost6").on("click", function () {//Dynamic  失败了  要序列化就可以了
            $.ajax({ url: "/api/users/RegisterObjectDynamic", type: "post", data: { "User": user, "Info": info }, success: function (data) { alert(data); }, datatype: "json", contentType: 'application/json' });
        });
        //也可以还是包装成一个对象
        $("#btnPut1").on("click", function () {//单个值传递，json数据不要key，这样后台才能获取
            $.ajax({ url: "/api/users/RegisterNoKeyPut", type: "put", data: { "": $("#txtId").val() }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPut2").on("click", function () {//key-value形式后台拿不到
            $.ajax({ url: "/api/users/RegisterPut", type: "put", data: { "id": $("#txtId").val() }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPut3").on("click", function () {//传递json格式的，后台可以用实体接收
            $.ajax({ url: "/api/users/RegisterUserPut", type: "put", data: user, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPut4").on("click", function () {//传递json序列化后的格式，后台可以用实体接收,需要指定contentType
            $.ajax({ url: "/api/users/RegisterUserPut", type: "put", data: JSON.stringify(user), success: function (data) { alert(data); }, datatype: "json", contentType: 'application/json', });
        });
        $("#btnPut5").on("click", function () {//JObject接收
            $.ajax({ url: "/api/users/RegisterObjectPut", type: "put", data: { "User": user, "Info": info }, success: function (data) { alert(data); }, datatype: "json" });
        });
        $("#btnPut6").on("click", function () {//Dynamic  失败了
            $.ajax({ url: "/api/users/RegisterObjectDynamicPut", type: "put", data: { "User": user, "Info": info }, success: function (data) { alert(data); }, datatype: "json", contentType: 'application/json' });
        });
        //delete一样 type换成delete
        //如果大家还有别的传递和获取 自动绑定好的方式，欢迎分享
        $("#btnLogin").on("click", function () {
            $.ajax({
                url: "/api/users/Login",
                type: "GET",
                data: { "Account": $("#txtAccount").val(), "Password": $("#txtPassword").val() },
                success: function (data) {
                    var result = JSON.parse(data);
                    if (result.Result) {
                        ticket = result.Ticket;
                        alert(result.Ticket);
                    }
                    else {
                        alert("failed");
                    }
                }, datatype: "json"
            });
        });
        var ticket = "";//登陆后放在某个html里面，ajax都得带上
        //microsoft.aspnet.webapi.cors
        jQuery.support.cors = true;
        var location = "http://localhost:8888";
        $("#btnGetCors1").on("click", function () {
            $.ajax({ url: location + "/api/users/GetUserByID", type: "get", data: { "id": 1 }, success: function (data) { alert(data); }, datatype: "json" });
        });
    });
</script>
```


## 后端调用

WebApi全部遵循http协议，httpMethod，后端模拟http请求，有两张方式：HttpWebRequest和HttpClient

```csharp
[TestClass]
public class WebapiTest
{
    [TestMethod]
    public void TestMethod()
    {
        this.AuthorizationDemo();
        var result1 = this.GetClient();
        var result2 = this.GetWebQuest();
        var result3 = this.PostClient();
        var result4 = this.PostWebQuest();
        var result5 = this.PutClient();
        var result6 = this.PutWebQuest();
        var result7 = this.DeleteClient();//传值只能是url
        var result8 = this.DeleteWebQuest();
        //Console.WriteLine();
    }
    #region HttpClient Get
    /// <summary>
    /// HttpClient实现Get请求
    /// </summary>
    private string GetClient()
    {
        //string url = "http://localhost:8888/api/users/GetUserByName?username=superman";
        //string url = "http://localhost:8888/api/users/GetUserByID?id=1";
        //string url = "http://localhost:8888/api/users/GetUserByNameId?userName=Superman&id=1";
        //string url = "http://localhost:8888/api/users/Get";
        //string url = "http://localhost:8888/api/users/GetUserByModel?UserID=11&UserName=Eleven&UserEmail=57265177%40qq.com";
        string url = "http://localhost:8888/api/users/GetUserByModelUri?UserID=11&UserName=Eleven&UserEmail=57265177%40qq.com";
        //string url = "http://localhost:8888/api/users/GetUserByModelSerialize?userString=%7B%22UserID%22%3A%2211%22%2C%22UserName%22%3A%22Eleven%22%2C%22UserEmail%22%3A%2257265177%40qq.com%22%7D";
        //string url = "http://localhost:8888/api/users/GetUserByModelSerializeWithoutGet?userString=%7B%22UserID%22%3A%2211%22%2C%22UserName%22%3A%22Eleven%22%2C%22UserEmail%22%3A%2257265177%40qq.com%22%7D";
        //string url = "http://localhost:8888/api/users/NoGetUserByModelSerializeWithoutGet?userString=%7B%22UserID%22%3A%2211%22%2C%22UserName%22%3A%22Eleven%22%2C%22UserEmail%22%3A%2257265177%40qq.com%22%7D";
        var handler = new HttpClientHandler();//{ AutomaticDecompression = DecompressionMethods.GZip };
        using (var http = new HttpClient(handler))
        {
            var response = http.GetAsync(url).Result;//拿到异步结果
            Console.WriteLine(response.StatusCode); //确保HTTP成功状态值
            //await异步读取最后的JSON（注意此时gzip已经被自动解压缩了，因为上面的AutomaticDecompression = DecompressionMethods.GZip）
            return response.Content.ReadAsStringAsync().Result;
        }
    }
    #endregion
    #region HttpWebRequest实现Get请求
    /// <summary>
    /// HttpWebRequest实现Get请求
    /// </summary>
    private string GetWebQuest()
    {
        //string url = "http://localhost:8888/api/users/GetUserByName?username=superman";
        //string url = "http://localhost:8888/api/users/GetUserByID?id=1";
        //string url = "http://localhost:8888/api/users/GetUserByNameId?userName=Superman&id=1";
        //string url = "http://localhost:8888/api/users/Get";
        //string url = "http://localhost:8888/api/users/GetUserByModel?UserID=11&UserName=Eleven&UserEmail=57265177%40qq.com";
        //string url = "http://localhost:8888/api/users/GetUserByModelUri?UserID=11&UserName=Eleven&UserEmail=57265177%40qq.com";
        string url = "http://localhost:8888/api/users/GetUserByModelSerialize?userString=%7B%22UserID%22%3A%2211%22%2C%22UserName%22%3A%22Eleven%22%2C%22UserEmail%22%3A%2257265177%40qq.com%22%7D";
        //string url = "http://localhost:8888/api/users/GetUserByModelSerializeWithoutGet?userString=%7B%22UserID%22%3A%2211%22%2C%22UserName%22%3A%22Eleven%22%2C%22UserEmail%22%3A%2257265177%40qq.com%22%7D";
        //string url = "http://localhost:8888/api/users/NoGetUserByModelSerializeWithoutGet?userString=%7B%22UserID%22%3A%2211%22%2C%22UserName%22%3A%22Eleven%22%2C%22UserEmail%22%3A%2257265177%40qq.com%22%7D";
        HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
        request.Timeout = 30 * 1000;
        //request.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36";
        //request.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
        string result = "";
        using (var res = request.GetResponse() as HttpWebResponse)
        {
            if (res.StatusCode == HttpStatusCode.OK)
            {
                StreamReader reader = new StreamReader(res.GetResponseStream(), Encoding.UTF8);
                result = reader.ReadToEnd();
            }
        }
        return result;
    }
    #endregion
    #region HttpClient实现Post请求
    /// <summary>
    /// HttpClient实现Post请求
    /// </summary>
    private string PostClient()
    {
        //string url = "http://localhost:8888/api/users/register";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"","1" }
        //};
        //string url = "http://localhost:8888/api/users/RegisterNoKey";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"","1" }
        //};
        //string url = "http://localhost:8888/api/users/RegisterUser";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"UserID","11" },
        //    {"UserName","Eleven" },
        //    {"UserEmail","57265177@qq.com" },
        //};
        string url = "http://localhost:8888/api/users/RegisterObject";
        Dictionary<string, string> dic = new Dictionary<string, string>()
        {
            {"User[UserID]","11" },
            {"User[UserName]","Eleven" },
            {"User[UserEmail]","57265177@qq.com" },
            {"Info","this is muti model" }
        };
        HttpClientHandler handler = new HttpClientHandler();
        using ( var http = new HttpClient(handler))
        {
            //使用FormUrlEncodedContent做HttpContent
            var content = new FormUrlEncodedContent(dic);
            var response = http.PostAsync(url, content).Result;
            Console.WriteLine(response.StatusCode); //确保HTTP成功状态值
            return response.Content.ReadAsStringAsync().Result;
        }
    }
    #endregion
    #region  HttpWebRequest实现post请求
    /// <summary>
    /// HttpWebRequest实现post请求
    /// </summary>
    private string PostWebQuest()
    {
        //string url = "http://localhost:8888/api/users/register";
        //var postData = "1";
        //string url = "http://localhost:8888/api/users/RegisterNoKey";
        //var postData = "1";
        var user = new
        {
            UserID = "11",
            UserName = "Eleven",
            UserEmail = "57265177@qq.com"
        };
        //string url = "http://localhost:8888/api/users/RegisterUser";
        //var postData = JsonHelper.ObjectToString(user);
        var userOther = new
        {
            User = user,
            Info = "this is muti model"
        };
        string url = "http://localhost:8888/api/users/RegisterObject";
        var postData = Newtonsoft.Json.JsonConvert.SerializeObject(userOther);
        var request = HttpWebRequest.Create(url) as HttpWebRequest;
        request.Timeout = 30 * 1000;//设置30s的超时
        request.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36";
        request.ContentType = "application/json";
        request.Method = "POST";
        byte[] data = Encoding.UTF8.GetBytes(postData);
        request.ContentLength = data.Length;
        Stream postStream = request.GetRequestStream();
        postStream.Write(data, 0, data.Length);
        postStream.Close();
        string result = "";
        using (var res = request.GetResponse() as HttpWebResponse)
        {
            if (res.StatusCode == HttpStatusCode.OK)
            {
                StreamReader reader = new StreamReader(res.GetResponseStream(), Encoding.UTF8);
                result = reader.ReadToEnd();
            }
        }
        return result;
    }
    #endregion
    #region HttpClient实现Put请求
    /// <summary>
    /// HttpClient实现Put请求
    /// </summary>
    private string PutClient()
    {
        string url = "http://localhost:8888/api/users/RegisterPut";
        Dictionary<string, string> dic = new Dictionary<string, string>()
        {
            {"","1" }
        };
        //string url = "http://localhost:8888/api/users/RegisterNoKeyPut";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"","1" }
        //};
        //string url = "http://localhost:8888/api/users/RegisterUserPut";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"UserID","11" },
        //    {"UserName","Eleven" },
        //    {"UserEmail","57265177@qq.com" },
        //};
        //string url = "http://localhost:8888/api/users/RegisterObjectPut";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"User[UserID]","11" },
        //    {"User[UserName]","Eleven" },
        //    {"User[UserEmail]","57265177@qq.com" },
        //    {"Info","this is muti model" }
        //};
        HttpClientHandler handler = new HttpClientHandler();
        using (var http = new HttpClient(handler))
        {
            //使用FormUrlEncodedContent做HttpContent
            var content = new FormUrlEncodedContent(dic);
            var response = http.PutAsync(url, content).Result;
            Console.WriteLine(response.StatusCode); //确保HTTP成功状态值
            return response.Content.ReadAsStringAsync().Result;
        }
    }
    #endregion
    #region  HttpWebRequest实现put请求
    /// <summary>
    /// HttpWebRequest实现put请求
    /// </summary>
    private string PutWebQuest()
    {
        //string url = "http://localhost:8888/api/users/registerPut";
        //var postData = "1";
        //string url = "http://localhost:8888/api/users/RegisterNoKeyPut";
        //var postData = "1";
        var user = new
        {
            UserID = "11",
            UserName = "Eleven",
            UserEmail = "57265177@qq.com"
        };
        //string url = "http://localhost:8888/api/users/RegisterUserPut";
        //var postData = JsonHelper.ObjectToString(user);
        var userOther = new
        {
            User = user,
            Info = "this is muti model"
        };
        string url = "http://localhost:8888/api/users/RegisterObjectPut";
        var postData = Newtonsoft.Json.JsonConvert.SerializeObject(userOther);
        var request = HttpWebRequest.Create(url) as HttpWebRequest;
        request.Timeout = 30 * 1000;//设置30s的超时
        request.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36";
        request.ContentType = "application/json";
        request.Method = "PUT";
        byte[] data = Encoding.UTF8.GetBytes(postData);
        request.ContentLength = data.Length;
        Stream postStream = request.GetRequestStream();
        postStream.Write(data, 0, data.Length);
        postStream.Close();
        string result = "";
        using (var res = request.GetResponse() as HttpWebResponse)
        {
            if (res.StatusCode == HttpStatusCode.OK)
            {
                StreamReader reader = new StreamReader(res.GetResponseStream(), Encoding.UTF8);
                result = reader.ReadToEnd();
            }
        }
        return result;
    }
    #endregion
    #region HttpClient实现Delete请求
    /// <summary>
    /// HttpClient实现Put请求
    /// 没放入数据
    /// </summary>
    private string DeleteClient()
    {
        string url = "http://localhost:8888/api/users/RegisterDelete/1";
        Dictionary<string, string> dic = new Dictionary<string, string>()
        {
            {"","1" }
        };
        //string url = "http://localhost:8888/api/users/RegisterNoKeyDelete";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"","1" }
        //};
        //string url = "http://localhost:8888/api/users/RegisterUserDelete";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"UserID","11" },
        //    {"UserName","Eleven" },
        //    {"UserEmail","57265177@qq.com" },
        //};
        //string url = "http://localhost:8888/api/users/RegisterObjectDelete";
        //Dictionary<string, string> dic = new Dictionary<string, string>()
        //{
        //    {"User[UserID]","11" },
        //    {"User[UserName]","Eleven" },
        //    {"User[UserEmail]","57265177@qq.com" },
        //    {"Info","this is muti model" }
        //};
        HttpClientHandler handler = new HttpClientHandler();
        using (var http = new HttpClient(handler))
        {
            //使用FormUrlEncodedContent做HttpContent
            var content = new FormUrlEncodedContent(dic);
            var response = http.DeleteAsync(url).Result;
            Console.WriteLine(response.StatusCode); //确保HTTP成功状态值
            return response.Content.ReadAsStringAsync().Result;
        }
    }
    #endregion
    #region  HttpWebRequest实现put请求
    /// <summary>
    /// HttpWebRequest实现put请求
    /// </summary>
    private string DeleteWebQuest()
    {
        //string url = "http://localhost:8888/api/users/registerDelete";
        //var postData = "1";
        //string url = "http://localhost:8888/api/users/RegisterNoKeyDelete";
        //var postData = "1";
        var user = new
        {
            UserID = "11",
            UserName = "Eleven",
            UserEmail = "57265177@qq.com"
        };
        //string url = "http://localhost:8888/api/users/RegisterUserDelete";
        //var postData = JsonHelper.ObjectToString(user);
        var userOther = new
        {
            User = user,
            Info = "this is muti model"
        };
        string url = "http://localhost:8888/api/users/RegisterObjectDelete";
        var postData = Newtonsoft.Json.JsonConvert.SerializeObject(userOther);
        var request = HttpWebRequest.Create(url) as HttpWebRequest;
        request.Timeout = 30 * 1000;//设置30s的超时
        request.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36";
        request.ContentType = "application/json";
        request.Method = "Delete";
        byte[] data = Encoding.UTF8.GetBytes(postData);
        request.ContentLength = data.Length;
        Stream postStream = request.GetRequestStream();
        postStream.Write(data, 0, data.Length);
        postStream.Close();
        string result = "";
        using (var res = request.GetResponse() as HttpWebResponse)
        {
            if (res.StatusCode == HttpStatusCode.OK)
            {
                StreamReader reader = new StreamReader(res.GetResponseStream(), Encoding.UTF8);
                result = reader.ReadToEnd();
            }
        }
        return result;
    }
    #endregion
    #region 用户登陆 获取ticket后使用
    private void AuthorizationDemo()
    {
        string ticket = "";
        {
            string loginUrl = "http://localhost:8888/api/users/Login?Account=Admin&Password=123456";
            var handler = new HttpClientHandler();//{ AutomaticDecompression = DecompressionMethods.GZip };
            using (var http = new HttpClient(handler))
            {
                var response = http.GetAsync(loginUrl).Result;//拿到异步结果
                Console.WriteLine(response.StatusCode); //确保HTTP成功状态值
                                                        //await异步读取最后的JSON（注意此时gzip已经被自动解压缩了，因为上面的AutomaticDecompression = DecompressionMethods.GZip）
                ticket = response.Content.ReadAsStringAsync().Result.Replace("\"{\\\"Result\\\":true,\\\"Ticket\\\":\\\"", "").Replace("\\\"}\"", "");
                //ticket = JsonHelper.StringToObject<TicketModel>(response.Content.ReadAsStringAsync().Result).Ticket;
            }
        }
        {
            string url = "http://localhost:8888/api/users/GetUserByName?username=superman";
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.Timeout = 30 * 1000;
            request.Headers.Add(HttpRequestHeader.Authorization, "BasicAuth " + ticket);//头文件增加Authorization
            //request.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36";
            //request.ContentType = "application/x-www-form-urlencoded; charset=UTF-8";
            string result = "";
            using (var res = request.GetResponse() as HttpWebResponse)
            {
                if (res.StatusCode == HttpStatusCode.OK)
                {
                    StreamReader reader = new StreamReader(res.GetResponseStream(), Encoding.UTF8);
                    result = reader.ReadToEnd();
                }
            }
        }
        {
            string url = "http://localhost:8888/api/users/GetUserByName?username=superman";
            var handler = new HttpClientHandler();
            using (var http = new HttpClient(handler))
            {
                http.DefaultRequestHeaders.Add("Authorization", "BasicAuth " + ticket);//头文件增加Authorization
                var response = http.GetAsync(url).Result;
                Console.WriteLine(response.StatusCode);
                string result = response.Content.ReadAsStringAsync().Result;
            }
        }
    }
    #endregion
}
```


using (var http = new HttpClient(handler)) 不太好  tcp其实并不能立即释放掉

如果是高并发的这样操作，会出现资源不够  积极拒绝

HttpClient内部有个连接池，各个请求是隔开的

要求HttpClient的实例化都从这里来  全局只要一个实例，不要using

各个请求是隔开的，可以复用链接的 ，实际应该单例一下

```csharp
public class HttpClientFactory
{
    private static HttpClient _HttpClient = null;
    static HttpClientFactory()
    {
        _HttpClient = new HttpClient(new HttpClientHandler());
    }
    public static HttpClient GetHttpClient()
    {
        return _HttpClient;
    }
}
```
