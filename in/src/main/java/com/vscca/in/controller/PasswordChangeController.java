package com.vscca.in.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.vscca.in.dto.RequestDto;
import com.vscca.in.dto.ResponseDto;
import com.vscca.in.model.LoginTable;
import com.vscca.in.serivce.AccountAuthorization;
import com.vscca.in.serivce.LoginService;
import com.vscca.in.utill.VsccaConstants;

@RestController
public class PasswordChangeController {
    private final LoginService loginService;
    private final AccountAuthorization authorization;

    public PasswordChangeController(LoginService loginService, AccountAuthorization authorization) {
        this.loginService = loginService;
        this.authorization = authorization;
    }

    @CrossOrigin
    @PostMapping("/passwordChange")
    public ResponseDto passwordChange(HttpServletRequest request, @RequestBody RequestDto change) {
        LoginTable caller = authorization.authenticatedLogin(request.getHeader(VsccaConstants.TOKEN_HEADER));
        if (caller == null) {
            return response(401, "Unauthorized");
        }

        if (!authorization.isActiveAdministrator(caller)) {
            return response(403, "Forbidden");
        }

        if (!hasPassword(change) || change.getUserName() == null || change.getUserName().trim().isEmpty()) {
            return response(400, "User name and password are required");
        }

        LoginTable target = loginService.findByuserName(change.getUserName());
        if (target == null) {
            return response(404, "User not found");
        }

        return savePassword(target, change.getPassword());
    }

    @CrossOrigin
    @PostMapping("/passwordChangeSelf")
    public ResponseDto passwordChangeSelf(HttpServletRequest request, @RequestBody RequestDto change) {
        LoginTable caller = authorization.authenticatedLogin(request.getHeader(VsccaConstants.TOKEN_HEADER));
        if (caller == null) {
            return response(401, "Unauthorized");
        }
        if (!hasPassword(change)) {
            return response(400, "Password is required");
        }

        return savePassword(caller, change.getPassword());
    }

    private boolean hasPassword(RequestDto change) {
        return change != null && change.getPassword() != null && !change.getPassword().isEmpty();
    }

    private ResponseDto savePassword(LoginTable login, String password) {
        login.setPassword(password);
        loginService.save(login);
        return response(200, "success");
    }

    private ResponseDto response(int status, String message) {
        ResponseDto response = new ResponseDto();
        response.setSuccess(status);
        response.setMessage(message);
        return response;
    }
}
