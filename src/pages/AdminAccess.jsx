import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'

const AdminAccess = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('import.meta.env.VITE_API_BASE_URL/api/users/')
      .then(res => {
        setUsers(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Users fetch error:', err)
        setLoading(false)
      })
  }, [])

  return (
    <Layout>
      <div style={{ padding: '32px 40px', backgroundColor: '#f4f7f9', minHeight: '100%', fontFamily: 'sans-serif' }}>
        <h2 style={{ color: '#0f172a', fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0' }}>
          Admin Access
        </h2>
        <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0', fontWeight: '500' }}>
          Manage all agents and managers
        </p>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>ID</th>
                <th style={{ padding: '12px 16px' }}>Username</th>
                <th style={{ padding: '12px 16px' }}>Email</th>
                <th style={{ padding: '12px 16px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: '20px', color: '#64748b' }}>Loading...</td></tr>
              ) : users.length > 0 ? (
                Array.isArray(users) && users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px', color: '#334155', fontSize: '13px' }}>{u.id}</td>
                    <td style={{ padding: '16px', color: '#334155', fontWeight: '600', fontSize: '13px' }}>{u.username}</td>
                    <td style={{ padding: '16px', color: '#64748b', fontSize: '13px' }}>{u.email}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '700',
                        background: u.role === 'manager' ? '#dcfce7' : '#dbeafe',
                        color: u.role === 'manager' ? '#166534' : '#1e40af',
                      }}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ padding: '20px', color: '#64748b' }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}

export default AdminAccess