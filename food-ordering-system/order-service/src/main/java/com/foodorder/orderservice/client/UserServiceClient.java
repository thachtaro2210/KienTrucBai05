package com.foodorder.orderservice.client;

import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Map;

@FeignClient(name = "user-service", url = "${services.user-service.url}")
public interface UserServiceClient {

    @GetMapping("/api/v1/users/{id}")
    UserApiResponse getUserByIdRaw(@PathVariable("id") String id);

    default UserDto validateUser(String id) {
        try {
            UserApiResponse response = getUserByIdRaw(id);
            if (response != null && response.getData() != null) {
                Map<String, Object> data = response.getData();
                UserDto userDto = new UserDto();
                userDto.setId((String) data.get("id"));
                userDto.setFullName((String) data.get("fullName"));
                userDto.setEmail((String) data.get("email"));
                return userDto;
            }
        } catch (Exception e) {
            return null;
        }
        return null;
    }

    @Data
    class UserDto {
        private String id;
        private String fullName;
        private String email;
    }

    @Data
    class UserApiResponse {
        private boolean success;
        private int code;
        private String message;
        private Map<String, Object> data;
    }
}
