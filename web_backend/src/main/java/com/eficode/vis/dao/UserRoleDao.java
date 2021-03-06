package com.eficode.vis.dao;

import com.eficode.vis.model.UserRole;
import com.eficode.vis.util.HibernateUtil;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

public class UserRoleDao {
    
    protected static final SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
    protected static final String className = "UserRole";
    
    public UserRole get(String name) {
        UserRole object = null;
        Session session = sessionFactory.openSession();
        Query query = session.createQuery("from " + this.className + " p where p.name = :NAME");
        query.setParameter("NAME", name);
        object = (UserRole) query.uniqueResult();
        session.close();
        return object;
    }
    
}
