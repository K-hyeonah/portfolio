# Pagination Fragment 사용법

## 1. List 페이지용 Pagination (기존)
```html
<!-- list.html에서 사용 -->
<div th:replace="~{common/pagination :: pagination}"></div>
```

## 2. 일반적인 Pagination (다른 페이지용)
```html
<!-- 다른 페이지에서 사용할 때 -->
<div th:replace="~{common/pagination :: generic-pagination}"></div>
```

## 3. Controller에서 필요한 Model Attributes

### List 페이지용 (기존)
```java
model.addAttribute("totalPages", totalPages);
model.addAttribute("pageNo", pageNo);
model.addAttribute("startPage", startPage);
model.addAttribute("endPage", endPage);
model.addAttribute("amount", amount);
model.addAttribute("mode", mode);
model.addAttribute("region", region);
model.addAttribute("subRegion", subRegion);
model.addAttribute("category", category);
```

### 일반적인 Pagination용
```java
model.addAttribute("totalPages", totalPages);
model.addAttribute("pageNo", pageNo);
model.addAttribute("startPage", startPage);
model.addAttribute("endPage", endPage);
model.addAttribute("amount", amount);
model.addAttribute("baseUrl", "/your-page-url"); // 기본 URL 설정
```

## 4. CSS 클래스

### 기본 클래스
- `.pagination` - 기본 pagination 스타일
- `.page-link` - 페이지 링크 스타일
- `.page-link.active` - 현재 페이지 스타일

### 특정 페이지용 클래스
- `.list-pagination` - List 페이지용
- `.community-pagination` - Community 페이지용
- `.booking-pagination` - Booking 페이지용

## 5. 사용 예시

### Community 페이지에서 사용
```html
<!-- community.html -->
<link rel="stylesheet" href="/resources/css/pagination.css">

<!-- pagination 사용 -->
<div th:replace="~{common/pagination :: generic-pagination}"></div>
```

### Controller에서 baseUrl 설정
```java
@GetMapping("/notice")
public String community(Model model, 
                       @RequestParam(defaultValue = "1") int pageNo,
                       @RequestParam(defaultValue = "10") int amount) {
    // ... 데이터 조회 로직 ...
    
    model.addAttribute("totalPages", totalPages);
    model.addAttribute("pageNo", pageNo);
    model.addAttribute("startPage", startPage);
    model.addAttribute("endPage", endPage);
    model.addAttribute("amount", amount);
    model.addAttribute("baseUrl", "/notice");
    
    return "notice";
}
```

## 6. 반응형 디자인
- 모바일에서는 pagination이 자동으로 줄어듭니다
- 작은 화면에서는 페이지 번호가 줄어들고 간격이 조정됩니다
