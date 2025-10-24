// 리뷰 API 유틸리티 함수들
// 기존 review.js와 company_review.js에서 사용할 공통 API 함수

window.ReviewAPI = {
    // 아이템별 리뷰 목록 조회
    async getReviewsByItem(itemId) {
        try {
            const response = await fetch(`/review/item/${itemId}`);
            if (!response.ok) throw new Error('Failed to fetch reviews');
            return await response.json();
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return [];
        }
    },

    // 리뷰 상세 조회
    async getReviewById(reviewId) {
        try {
            const response = await fetch(`/review/${reviewId}`);
            if (!response.ok) throw new Error('Failed to fetch review');
            return await response.json();
        } catch (error) {
            console.error('Error fetching review:', error);
            return null;
        }
    },

    // 리뷰 작성
    async createReview(formData) {
        try {
            const response = await fetch('/review', {
                method: 'POST',
                body: formData // multipart/form-data
            });
            if (!response.ok) throw new Error('Failed to create review');
            return await response.json();
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    // 리뷰 수정
    async updateReview(reviewId, formData) {
        try {
            const response = await fetch(`/review/${reviewId}`, {
                method: 'PUT',
                body: formData
            });
            if (!response.ok) throw new Error('Failed to update review');
            return await response.json();
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    // 리뷰 삭제
    async deleteReview(reviewId) {
        try {
            const response = await fetch(`/review/${reviewId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete review');
            return true;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    },

    // 아이템 평균 평점 조회
    async getAverageRating(itemId) {
        try {
            const response = await fetch(`/review/item/${itemId}/average-rating`);
            if (!response.ok) throw new Error('Failed to fetch average rating');
            return await response.json();
        } catch (error) {
            console.error('Error fetching average rating:', error);
            return 0;
        }
    },

    // 아이템 리뷰 개수 조회
    async getReviewCount(itemId) {
        try {
            const response = await fetch(`/review/item/${itemId}/count`);
            if (!response.ok) throw new Error('Failed to fetch review count');
            return await response.json();
        } catch (error) {
            console.error('Error fetching review count:', error);
            return 0;
        }
    },

    // 리뷰 이미지 URL 생성
    getReviewImageUrl(reviewId) {
        return `/review/image/${reviewId}`;
    },

    // 답글 작성
    async createReply(reviewId, companyId, body, isPublic = true) {
        try {
            const formData = new URLSearchParams();
            formData.append('reviewId', reviewId);
            formData.append('companyId', companyId);
            formData.append('body', body);
            formData.append('isPublic', isPublic);

            const response = await fetch('/review/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to create reply');
            }
            return await response.json();
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    },

    // 답글 수정
    async updateReply(replyId, body) {
        try {
            const formData = new URLSearchParams();
            formData.append('body', body);

            const response = await fetch(`/review/reply/${replyId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            });
            if (!response.ok) throw new Error('Failed to update reply');
            return await response.json();
        } catch (error) {
            console.error('Error updating reply:', error);
            throw error;
        }
    },

    // 답글 삭제
    async deleteReply(replyId) {
        try {
            const response = await fetch(`/review/reply/${replyId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete reply');
            return true;
        } catch (error) {
            console.error('Error deleting reply:', error);
            throw error;
        }
    },

    // 업체의 답글 목록 조회
    async getRepliesByCompany(companyId) {
        try {
            const response = await fetch(`/review/company/${companyId}/replies`);
            if (!response.ok) throw new Error('Failed to fetch replies');
            return await response.json();
        } catch (error) {
            console.error('Error fetching replies:', error);
            return [];
        }
    },

    // 업체가 답글을 작성했는지 확인
    async hasCompanyReplied(reviewId, companyId) {
        try {
            const response = await fetch(`/review/${reviewId}/company/${companyId}/has-replied`);
            if (!response.ok) throw new Error('Failed to check reply status');
            return await response.json();
        } catch (error) {
            console.error('Error checking reply status:', error);
            return false;
        }
    },

    // 사용자별 리뷰 목록 조회
    async getReviewsByUser(userId) {
        try {
            const response = await fetch(`/review/user/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch user reviews');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user reviews:', error);
            return [];
        }
    },

    // 예약 ID로 리뷰 조회
    async getReviewByBooking(bookingId) {
        try {
            const response = await fetch(`/review/booking/${bookingId}`);
            if (response.status === 404) return null;
            if (!response.ok) throw new Error('Failed to fetch review by booking');
            return await response.json();
        } catch (error) {
            console.error('Error fetching review by booking:', error);
            return null;
        }
    },

    // 리뷰 작성 가능 여부 확인
    async canWriteReview(bookingId) {
        try {
            const response = await fetch(`/review/booking/${bookingId}/can-write`);
            if (!response.ok) throw new Error('Failed to check review availability');
            return await response.json();
        } catch (error) {
            console.error('Error checking review availability:', error);
            return false;
        }
    },

    // 특정 리뷰의 답글 조회
    async getRepliesByReview(reviewId) {
        try {
            const response = await fetch(`/review/reply/review/${reviewId}`);
            if (!response.ok) throw new Error('Failed to fetch replies');
            return await response.json();
        } catch (error) {
            console.error('Error fetching replies:', error);
            return [];
        }
    }
};

// 예약 API
const ReservationAPI = {
    // 사용자의 예약 목록 조회
    async getUserReservations(userId) {
        try {
            const response = await fetch(`/api/reservations/user/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch reservations');
            return await response.json();
        } catch (error) {
            console.error('Error fetching reservations:', error);
            return [];
        }
    },

    // 예약 상세 조회
    async getReservationById(reservationId) {
        try {
            const response = await fetch(`/api/reservations/${reservationId}`);
            if (!response.ok) throw new Error('Failed to fetch reservation');
            return await response.json();
        } catch (error) {
            console.error('Error fetching reservation:', error);
            return null;
        }
    }
};

// 아이템 API
const ItemAPI = {
    // 업체의 아이템 목록 조회
    async getItemsByCompany(companyId) {
        try {
            const response = await fetch(`/api/review/company-items/${companyId}`);
            if (!response.ok) throw new Error('Failed to fetch items');
            return await response.json();
        } catch (error) {
            console.error('Error fetching items:', error);
            return [];
        }
    },

    // 아이템 상세 조회
    async getItemById(itemId) {
        try {
            const response = await fetch(`/api/review/item/${itemId}`);
            if (!response.ok) throw new Error('Failed to fetch item');
            return await response.json();
        } catch (error) {
            console.error('Error fetching item:', error);
            return null;
        }
    },

    // ========== 답글 API ==========
    
    // 답글 작성
    async createReply(reviewId, companyId, body, isPublic = true) {
        try {
            const formData = new FormData();
            formData.append('reviewId', reviewId);
            formData.append('companyId', companyId);
            formData.append('body', body);
            formData.append('isPublic', isPublic);
            
            const response = await fetch('/review/reply', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) throw new Error('Failed to create reply');
            return await response.json();
        } catch (error) {
            console.error('Error creating reply:', error);
            throw error;
        }
    },
    
    // 답글 수정
    async updateReply(replyId, body, isPublic = true) {
        try {
            const formData = new FormData();
            formData.append('body', body);
            formData.append('isPublic', isPublic);
            
            const response = await fetch(`/review/reply/${replyId}`, {
                method: 'PUT',
                body: formData
            });
            
            if (!response.ok) throw new Error('Failed to update reply');
            return await response.json();
        } catch (error) {
            console.error('Error updating reply:', error);
            throw error;
        }
    },
    
    // 답글 삭제
    async deleteReply(replyId) {
        try {
            const response = await fetch(`/review/reply/${replyId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete reply');
            return true;
        } catch (error) {
            console.error('Error deleting reply:', error);
            throw error;
        }
    },
    
    // 특정 리뷰의 답글 조회
    async getRepliesByReview(reviewId) {
        try {
            const response = await fetch(`/review/reply/review/${reviewId}`);
            if (!response.ok) throw new Error('Failed to fetch replies');
            return await response.json();
        } catch (error) {
            console.error('Error fetching replies:', error);
            return [];
        }
    },
    
    // 특정 리뷰의 공개된 답글만 조회
    async getPublicRepliesByReview(reviewId) {
        try {
            const response = await fetch(`/review/reply/review/${reviewId}/public`);
            if (!response.ok) throw new Error('Failed to fetch public replies');
            return await response.json();
        } catch (error) {
            console.error('Error fetching public replies:', error);
            return [];
        }
    },
    
    // 특정 업체의 답글 조회
    async getRepliesByCompany(companyId) {
        try {
            const response = await fetch(`/review/reply/company/${companyId}`);
            if (!response.ok) throw new Error('Failed to fetch company replies');
            return await response.json();
        } catch (error) {
            console.error('Error fetching company replies:', error);
            return [];
        }
    },
    
    // 답글 상세 조회
    async getReplyById(replyId) {
        try {
            const response = await fetch(`/review/reply/${replyId}`);
            if (!response.ok) throw new Error('Failed to fetch reply');
            return await response.json();
        } catch (error) {
            console.error('Error fetching reply:', error);
            return null;
        }
    },
    
    // 답글 공개/비공개 설정
    async toggleReplyVisibility(replyId) {
        try {
            const response = await fetch(`/review/reply/${replyId}/toggle-visibility`, {
                method: 'PATCH'
            });
            
            if (!response.ok) throw new Error('Failed to toggle reply visibility');
            return true;
        } catch (error) {
            console.error('Error toggling reply visibility:', error);
            throw error;
        }
    },
    
    // 업체가 특정 리뷰에 답글을 달았는지 확인
    async hasCompanyReplied(reviewId, companyId) {
        try {
            const response = await fetch(`/review/reply/check/${reviewId}/${companyId}`);
            if (!response.ok) throw new Error('Failed to check reply status');
            return await response.json();
        } catch (error) {
            console.error('Error checking reply status:', error);
            return false;
        }
    },
    
    // 특정 리뷰의 답글 개수
    async getReplyCount(reviewId) {
        try {
            const response = await fetch(`/review/reply/count/${reviewId}`);
            if (!response.ok) throw new Error('Failed to fetch reply count');
            return await response.json();
        } catch (error) {
            console.error('Error fetching reply count:', error);
            return 0;
        }
    }
};

