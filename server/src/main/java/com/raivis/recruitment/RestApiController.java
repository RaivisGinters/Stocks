package com.raivis.recruitment;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;


import org.springframework.web.bind.annotation.CookieValue;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Arrays;
import java.util.stream.Collectors;

import java.util.HashMap;

@RestController
public class RestApiController {

	private final String authCookieName = "raivisCookie";

	@PostMapping("/api/login")
	public Response login(@RequestBody User user, HttpServletResponse response) {

		HashMap<String,String> availableUsers = new HashMap<>();
		availableUsers.put("raivis", "eER4yngTdPS77zBz");
		availableUsers.put("juha", "nvcBFKTw98PkgRV8");
		availableUsers.put("ernests", "MRbC3jVyzZ9NvHPj");

		String username = user.getUsername();
		String password = user.getPassword();

		if (availableUsers.containsKey(username)) {
			if (availableUsers.get(username).equals(password)) {

				// create a cookie
			   	Cookie cookie = new Cookie(authCookieName, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VzSWQiOiI1ZTUyN2FlNDM2MDQ4MzhiYTRlM2VjMzQiLCJpYXQiPjE1ODMxNzUyNTcsImV4cCI6MTU4Mzc4MDA1N30.i0e33pjNn7eNdnkSGGfWR1ekuMyrkgpDOz0uW2rTFd4");
			   	cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days
			   	cookie.setSecure(false);
			   	cookie.setHttpOnly(true);
			   	cookie.setPath("/"); // global cookie accessible everywhere

			   	//add cookie to response
			   	response.addCookie(cookie);
				return new Response("success", "authorized");
			}
        }

		return new Response("error", "Wrong username or password");
	}

	@GetMapping("/api/logout")
	public Response readAllCookies(HttpServletResponse response) {
		StringBuilder stringBuilder = new StringBuilder();

		Cookie cookie = new Cookie(authCookieName, null);
		cookie.setMaxAge(0);
		cookie.setSecure(false);
		cookie.setHttpOnly(true);
		cookie.setPath("/"); // global cookie accessible everywhere

		//add cookie to response
		response.addCookie(cookie);

		return new Response("success", "logged out");
	}

	@GetMapping("/api/checkToken")
	public Response readAllCookies(HttpServletRequest request) {
		StringBuilder stringBuilder = new StringBuilder();

	    Cookie[] cookies = request.getCookies();
		for (int i = 0; i < cookies.length; i++) {
			if (cookies[i].getName().equals(authCookieName)) {
				return new Response("success", "authorized");
			}
		}

		return new Response("error", "Unauthorized user. Please log in");
	}

	@GetMapping("/api/request-data")
	public Response requestData(@RequestParam String dateFrom, String dateTo) {
		StringBuilder stringBuilder = new StringBuilder();

		String url = "https://eodhistoricaldata.com/api/eod/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX";
		url = url + "&order=a";
		url = url + "&from="+dateFrom;
		url = url + "&to="+dateTo;
		url = url + "&period=d";
		url = url + "&fmt=json";

		try {
			URL urlObject = new URL(url);
			BufferedReader br = new BufferedReader(new InputStreamReader(urlObject.openStream()));
			String str = "";
			while (null != (str = br.readLine())) {
				stringBuilder.append(str);
			}

		} catch (Exception ex) {
			ex.printStackTrace();
		}

		return new Response("success", stringBuilder.toString());
	}
}
