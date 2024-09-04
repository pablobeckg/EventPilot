import { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import supabaseClient from '../../lib/supabaseClient';
import { Profile } from '../../types/supabase-types-own';
import './ProfilePage.css';

const ProfilePage = () => {

    const userContext = useUserContext();
    const user = userContext?.user;
    const [profile, setProfile] = useState<Profile>();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    if (!user) {
        return;
      }

      const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
  
        const signoutResponse = await supabaseClient.auth.signOut();
    
        if (signoutResponse.error) {
          console.log('Logout error', signoutResponse.error);
        } else {
          userContext?.setUser(null);
        }
      }

      useEffect(() => {
        const fetchUserProfile = async () => {

          const profileResponse = await supabaseClient.from('profiles').select('*').eq('id', user.id).single();
    
          if (profileResponse.error) {
            console.error('Error getting profile', profileResponse.error.message);
          }
    
          if (profileResponse.data) {
            setProfile(profileResponse.data);
            if (profileResponse.data.avatar_url) {
              setAvatarUrl(profileResponse.data.avatar_url);
            }
          }
        };
        fetchUserProfile();
      }, [user]);

      const handleUpload = async () => {
        if (!avatarFile) {
          return;
        }
    
        setUploading(true);
        const fileName = `${user.id}_${avatarFile.name}`;

        const uploadAvatarResponse = await supabaseClient.storage
          .from('avatars')

          .upload(fileName, avatarFile, { upsert: true });
    
        if (uploadAvatarResponse.error) {
          console.error('Error uploading avatar', uploadAvatarResponse.error.message);
          setUploading(false);
          return;
        }

        const publicUrlForAvatarResponse = await supabaseClient.storage.from('avatars').getPublicUrl(fileName);

        if (!publicUrlForAvatarResponse.data) {
          console.error('Error getting public url');
          setUploading(false);
          return;
        }

        const updateProfilesResponse = await supabaseClient
          .from('profiles')

          .update({ avatar_url: publicUrlForAvatarResponse.data.publicUrl })
  
          .eq('id', user.id);
    
        setUploading(false);
        if (updateProfilesResponse.error) {
          console.error('Error setting avatar_url', updateProfilesResponse.error.message);
          return;
        } else {
          console.log('Update in profiles table successfull.');

          setAvatarUrl(publicUrlForAvatarResponse.data.publicUrl);
        }
      };
    
    return (
        <div className="profile-page">
        <h1 className="profile-name">{profile?.name}</h1>
        <div className="avatar-wrapper">
      {avatarUrl ? <img src={avatarUrl} alt="avatar" className="avatar-image"></img> : <p>No avatar.</p>}
      </div>
      <div className="upload-container">
        <label className="label-upload-avatar">Change your Avatar:</label>
        <input
          type="file"
          className="input"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setAvatarFile(e.target.files[0]);
              console.log(avatarFile);
            }
          }}
        />
      </div>
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      <div className="profile-about-me-followers">
        <div className="followers">
            <p>300</p>
            <p>Followers</p>
        </div>
        <div className="following">
            <p>500</p>
            <p>Following</p>
        </div>
      </div>
      <div className="profile-about-me-container">
        <strong>About me:</strong>
        {profile?.about_me}
      </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

    </div>
    );
}
 
export default ProfilePage;