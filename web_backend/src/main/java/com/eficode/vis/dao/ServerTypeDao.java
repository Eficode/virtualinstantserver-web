package com.eficode.vis.dao;

import com.eficode.vis.model.ServerType;
import com.eficode.vis.util.HibernateUtil;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

public class ServerTypeDao {
    
    protected static final SessionFactory sessionFactory = HibernateUtil.getSessionFactory();
    protected static final String className = "ServerType";
    
    public ServerType get(String name) {
        ServerType object = null;
        Session session = sessionFactory.openSession();
        Query query = session.createQuery("from " + this.className + " p where p.name = :NAME");
        query.setParameter("NAME", name);
        object = (ServerType) query.uniqueResult();
        session.close();
        return object;
    }
    
}
