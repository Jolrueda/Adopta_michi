import React from 'react';

interface UserProfileProps {
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
  };
}

const UserPerfil: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flexGrow: 1, padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          {user.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt={user.name} 
              style={{ width: '100px', height: '100px', borderRadius: '50%', marginRight: '20px' }} 
            />
          ) : (
            <div 
              style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                marginRight: '20px', 
                backgroundColor: '#eee', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '40px'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        {user.bio && (
          <div>
            <h3>Biografía</h3>
            <p>{user.bio}</p>
          </div>
        )}
        {/* Aquí se pueden agregar más secciones del perfil */}
      </div>
      <div style={{ width: '200px', marginLeft: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h4>Breadcrumb</h4>
        {/* Contenido del Breadcrumb irá aquí */}
        <p>Inicio / Perfil</p> 
      </div>
    </div>
  );
};

export default UserPerfil;