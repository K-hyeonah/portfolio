package com.example.ApiRound.Controller;

import java.util.Locale;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.support.RequestContextUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Controller
public class LanguageController {

    @GetMapping("/lang")
    public String changeLanguage(@RequestParam("code") String langCode,
                                 HttpServletRequest request,
                                 HttpServletResponse response) {

        LocaleResolver localeResolver = RequestContextUtils.getLocaleResolver(request);

        if (localeResolver != null) {
            Locale locale;
            if ("en".equalsIgnoreCase(langCode))       locale = Locale.ENGLISH;
            else if ("ja".equalsIgnoreCase(langCode))  locale = Locale.JAPANESE;
            else if ("zh".equalsIgnoreCase(langCode))  locale = Locale.CHINESE; // 필요시 zh_Hans/zh_Hant로 세분화
            else                                       locale = Locale.KOREAN;

            localeResolver.setLocale(request, response, locale);
        }

        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isEmpty()) {
            return "redirect:" + referer;
        }
        return "redirect:/";
    }
}
