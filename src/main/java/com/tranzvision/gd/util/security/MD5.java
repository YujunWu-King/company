/**
 * 
 */
package com.tranzvision.gd.util.security;

import java.security.NoSuchAlgorithmException;


/**
 * MD5加密，用户页面传输密码等关键信息的加密
 * 
 * @author caoyang
 * 
 */
public class MD5 {
	public String getMD5(byte[] source) {
		String s = null;
		char hexDigits[] = { // 用来将字节转换成 16 进制表示的字符
		'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'a',
				'b',
				'c',
				'd',
				'e',
				'f' };
		try {
			java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
			md.update(source);
			// MD5 的计算结果是一个 128 位的长整数，
			byte tmp[] = md.digest();
			// 用字节表示就是 16 个字节
			char str[] = new char[16 * 2]; // 每个字节用 16 进制表示的话，使用两个字符，
			// 所以表示成 16 进制需要 32 个字符
			int k = 0; // 表示转换结果中对应的字符位置
			for (int i = 0; i < 16; i++) { // 从第一个字节开始，对 MD5 的每一个字节
				// 转换成 16 进制字符的转换
				byte byte0 = tmp[i]; // 取第 i 个字节
				str[k++] = hexDigits[byte0 >>> 4 & 0xf]; // 取字节中高 4 位的数字转换,
				// >>> 为逻辑右移，将符号位一起右移
				str[k++] = hexDigits[byte0 & 0xf]; // 取字节中低 4 位的数字转换
			}
			s = new String(str); // 换后的结果转换为字符串
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (Exception e) {
			e.printStackTrace();
		}
		return s;
	}

	public static void main(String[] args) {
		MD5 md5 = new MD5();
		System.out.println(md5.getMD5("1qaz2wsx".getBytes()));
		System.out.println(md5.getMD5("1qaz2wsx".getBytes()));
		String a = "";
		//a.equals(anObject)
		System.out.println("62c8ad0a15d9d1ca38d5dee762a16e01");
	}
}
