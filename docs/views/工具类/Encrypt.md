---
title: 'Encrypt'
date: 2021-04-06
categories:
- "Csharp"
tags:
- Encrypt
sidebar: true
permalink: '/Tools/Encrypt'
isFull: true
isShowComments: true
isShowIndex: false
---

## 可对称加密

```csharp
public class DesEncrypt
{
    //8位长度
    private static string KEY = "ltltltlt";
    private static byte[] key = ASCIIEncoding.ASCII.GetBytes(KEY.Substring(0, 8));
    private static byte[] iv = ASCIIEncoding.ASCII.GetBytes(KEY.Insert(0, "w").Substring(0, 8));
    /// <summary>
    /// DES 加密
    /// </summary>
    /// <param name="strValue"></param>
    /// <returns></returns>
    public static string Encrypt(string strValue)
    {
        DESCryptoServiceProvider dsp = new DESCryptoServiceProvider();
        MemoryStream memStream = new MemoryStream();
        using (memStream)
        {
            CryptoStream crypStream = new CryptoStream(memStream, dsp.CreateEncryptor(key, iv), CryptoStreamMode.Write);
            StreamWriter sWriter = new StreamWriter(crypStream);
            sWriter.Write(strValue);
            sWriter.Flush();
            crypStream.FlushFinalBlock();
            memStream.Flush();
            return Convert.ToBase64String(memStream.GetBuffer(), 0, (int)memStream.Length);
        }
    }
    /// <summary>
    /// DES解密
    /// </summary>
    /// <param name="EncValue"></param>
    /// <returns></returns>
    public static string Decrypt(string EncValue)
    {
        DESCryptoServiceProvider dsp = new DESCryptoServiceProvider();
        byte[] buffer = Convert.FromBase64String(EncValue);
        MemoryStream memStream = new MemoryStream();
        using (memStream)
        {
            CryptoStream crypStream = new CryptoStream(memStream, dsp.CreateDecryptor(key, iv), CryptoStreamMode.Write);
            crypStream.Write(buffer, 0, buffer.Length);
            crypStream.FlushFinalBlock();
            return ASCIIEncoding.UTF8.GetString(memStream.ToArray());
        }
    }
}
```

## MD5加密

```csharp
public class MD5Encrypt
{
    #region MD5
    /// <summary>
    /// MD5加密,和动网上的16/32位MD5加密结果相同
    /// </summary>
    /// <param name="strSource">待加密字串</param>
    /// <param name="length">16或32值之一,其它则采用.net默认MD5加密算法</param>
    /// <returns>加密后的字串</returns>
    public static string Encrypt(string source, int length = 32)
    {
        HashAlgorithm provider = CryptoConfig.CreateFromName("MD5") as HashAlgorithm;
        if (string.IsNullOrEmpty(source)) return string.Empty;
        byte[] bytes = Encoding.ASCII.GetBytes(source);
        byte[] hashValue = provider.ComputeHash(bytes);
        StringBuilder sb = new StringBuilder();
        switch (length)
        {
            case 16://16位密文是32位密文的9到24位字符
                for (int i = 4; i < 12; i++)
                    sb.Append(hashValue[i].ToString("x2"));
                break;
            case 32:
                for (int i = 0; i < 16; i++)
                {
                    sb.Append(hashValue[i].ToString("x2"));
                }
                break;
            default:
                for (int i = 0; i < hashValue.Length; i++)
                {
                    sb.Append(hashValue[i].ToString("x2"));
                }
                break;
        }
        return sb.ToString();
    }
    #endregion MD5
}
```

## RsaEncrypt

```csharp
public class RsaEncrypt
{
    private static string PublicKey = @"BgIAAACkAABSU0ExAAQAAAEAAQDlrlvIesvhOZxK8dVyVMC+HUoB7FchNRkrUgJSK6FlfPpnoEPGq7bbO2FxebuFE331gNugopwq+82cylsQycSwFBBFbQTh+X9hmW2fOReRoCxDsGdlscm06BX/26fHqO09RoCpbTE+NDpe6PmNMoIopcvrLU5WeLD/EIsjFyvNvg==";
    private static string PrivateKey = @"BwIAAACkAABSU0EyAAQAAAEAAQDlrlvIesvhOZxK8dVyVMC+HUoB7FchNRkrUgJSK6FlfPpnoEPGq7bbO2FxebuFE331gNugopwq+82cylsQycSwFBBFbQTh+X9hmW2fOReRoCxDsGdlscm06BX/26fHqO09RoCpbTE+NDpe6PmNMoIopcvrLU5WeLD/EIsjFyvNvv28ikuyuQa95UBe5VNy/1HDrTo7BZYClfLULVVS/tAt/tqVMXS6p9JlFWR6SbrJUeR0PGFmLOdpj1NvkCVNrOMJUlrrFcGTnf+G8dKFxsqWZ9cmKffYMfIHVt1xqK6fkou4l1nA5z0gs/IAFvvmWyT3QQV1kQhWl21b7sCfdIrWZWlyB92wtMbGGbwJiwRDnCJ7gdt37wW3XSjSMDQqyGuNfnTM1XgCWzMTHNnFUqT35OUj5twmSSrqkbaZLxfElbm8TjBwudQDpgivvil396QH4dzo6r6NTU+/LDqzjtIv1DN31bhZhq9+Yezoxd8BSKiKMDwUZYFN/ztmtNDnO7gisZPy1ZGvltWuVCkpavWB6fNrZmqg5LcFH46vGmE4GR5CXg5PLMrlC0+97lpGLlU9XaB3kbXOQ1n9XfPkvJh+gdyXXcfymN3DAHRk352VlyexKkN+CBHzGEmzvVLqPG3DAvJnmHx0D+leLlxg8xp04CjkAL+rPk1+yhB6WMlU9I4sTyBPkmpOv188NC52JO/fSLd/ZuIf1NsceO4vLywbPskoQiVKn6PDzX0R6ztPvYvCON45GZ+NykzATXnczgM=";
    /// <summary>
    /// 获取密钥对   key公钥  value私鈅
    /// </summary>
    /// <returns></returns>
    public static KeyValuePair<string, string> GetKeyPair()
    {
        RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
        string publicKey = Convert.ToBase64String(rsa.ExportCspBlob(false));
        string privateKey = Convert.ToBase64String(rsa.ExportCspBlob(true));
        return new KeyValuePair<string, string>(publicKey, privateKey);
    }
    /// <summary>
    /// 加密
    /// </summary>
    /// <param name="content"></param>
    /// <param name="publicKey">为空使用默认公钥</param>
    /// <returns></returns>
    public static string Encrypt(string content, string publicKey = "")
    {
        UnicodeEncoding ByteConverter = new UnicodeEncoding();
        byte[] DataToEncrypt = ByteConverter.GetBytes(content);
        RSACryptoServiceProvider rsa = new RSACryptoServiceProvider();
        publicKey = string.IsNullOrEmpty(publicKey) ? PublicKey : publicKey;
        byte[] publicKeyBytes = Convert.FromBase64String(publicKey);
        rsa.ImportCspBlob(publicKeyBytes);//公钥加密
        byte[] resultBytes = rsa.Encrypt(DataToEncrypt, false);
        return Convert.ToBase64String(resultBytes);
    }
    /// <summary>
    /// 解密
    /// </summary>
    /// <param name="content"></param>
    /// <param name="privateKey">为空使用默认私鈅</param>
    /// <returns></returns>
    public static string Decrypt(string content, string privateKey = "")
    {
        byte[] dataToDecrypt = Convert.FromBase64String(content);
        RSACryptoServiceProvider RSA = new RSACryptoServiceProvider();
        privateKey = string.IsNullOrEmpty(privateKey) ? PrivateKey : privateKey;
        byte[] privateKeyBytes = Convert.FromBase64String(privateKey);
        RSA.ImportCspBlob(privateKeyBytes);
        byte[] resultBytes = RSA.Decrypt(dataToDecrypt, false);
        UnicodeEncoding ByteConverter = new UnicodeEncoding();
        return ByteConverter.GetString(resultBytes);
    }
}
```