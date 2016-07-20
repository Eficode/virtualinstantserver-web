package com.eficode.vis.service;

import com.eficode.vis.dao.ServerDao;
import com.eficode.vis.dao.ServerRoleToServerPermissionDao;
import com.eficode.vis.dao.UserRolesToPermissionsDao;

public abstract class AbstractService {
    
    public boolean userPermissionCheck(long userId, String name){
        UserRolesToPermissionsDao dao = new UserRolesToPermissionsDao();
        return dao.userPermissionsCheck(userId, name);
    }
    
    public boolean serverPermissionCheck(long userId, String methodName){
        ServerRoleToServerPermissionDao dao = new ServerRoleToServerPermissionDao();
        return dao.serverPermissionCheck(userId, methodName);
    }
    
    public boolean serverIpCheck(long upperLimit, long targetIp){
        ServerDao dao = new ServerDao();
        return dao.serverIpCheck(upperLimit, targetIp);
    }
}
