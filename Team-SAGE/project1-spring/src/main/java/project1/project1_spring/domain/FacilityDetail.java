package project1.project1_spring.domain;

import java.time.LocalDate; // 평가일자, 설립일자를 위한 LocalDate import

public class FacilityDetail {
    private Long id; // 시설의 고유 ID (Facility와 동일)
    private String name; // 기관명
    private String address; // 주소
    private String capacity; // 정원 (int 대신 Integer로 null 가능성 고려)
    private String currentOccupancy; // 현원
    private String waitingList; // 대기인원
    private String availability; // 이용가능여부 (예: "가능", "불가능" 등)
    private String phone; // 전화번호 (Facility와 중복되지만 상세 페이지용으로 재정의)
    private String selfPay; // 본인부담금
    private String programOperation; // 프로그램운영
    private String transportation; // 교통편
    private String parkingFacility; // 주차시설
    private String staffStatus; // 인력현황
    private String homepage; // 홈페이지
    private LocalDate evaluationDate; // 평가일자 (yyyy-MM-dd 형식의 String 또는 LocalDate)
    private String rating; // 평점
    private Double totalScore; // 총점
    private LocalDate establishDate; // 설립일자
    private String mainImage; // 대표사진 (Facility의 imageUrl과 유사)
    private String recommendation; // 추천 (텍스트 등)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCapacity() {
        return capacity;
    }

    public void setCapacity(String capacity) {
        this.capacity = capacity;
    }

    public String getCurrentOccupancy() {
        return currentOccupancy;
    }

    public void setCurrentOccupancy(String currentOccupancy) {
        this.currentOccupancy = currentOccupancy;
    }

    public String getWaitingList() {
        return waitingList;
    }

    public void setWaitingList(String waitingList) {
        this.waitingList = waitingList;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getSelfPay() {
        return selfPay;
    }

    public void setSelfPay(String selfPay) {
        this.selfPay = selfPay;
    }

    public String getProgramOperation() {
        return programOperation;
    }

    public void setProgramOperation(String programOperation) {
        this.programOperation = programOperation;
    }

    public String getTransportation() {
        return transportation;
    }

    public void setTransportation(String transportation) {
        this.transportation = transportation;
    }

    public String getParkingFacility() {
        return parkingFacility;
    }

    public void setParkingFacility(String parkingFacility) {
        this.parkingFacility = parkingFacility;
    }

    public String getStaffStatus() {
        return staffStatus;
    }

    public void setStaffStatus(String staffStatus) {
        this.staffStatus = staffStatus;
    }

    public String getHomepage() {
        return homepage;
    }

    public void setHomepage(String homepage) {
        this.homepage = homepage;
    }

    public LocalDate getEvaluationDate() {
        return evaluationDate;
    }

    public void setEvaluationDate(LocalDate evaluationDate) {
        this.evaluationDate = evaluationDate;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public Double getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Double totalScore) {
        this.totalScore = totalScore;
    }

    public LocalDate getEstablishDate() {
        return establishDate;
    }

    public void setEstablishDate(LocalDate establishDate) {
        this.establishDate = establishDate;
    }

    public String getMainImage() {
        return mainImage;
    }

    public void setMainImage(String mainImage) {
        this.mainImage = mainImage;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}