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
        return null;
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
            console.log('Update in profiles table successful.');
            setAvatarUrl(publicUrlForAvatarResponse.data.publicUrl);
        }
    };

    return (
        <div className="profile-page">
            <h1 className="profile-name">{profile?.name}</h1>
            <div className="avatar-wrapper">
                {avatarUrl ? (
                    <div
                        className="avatar-background"
                        style={{ backgroundImage: `url(${avatarUrl})` }}
                    ></div>
                ) : (
                    <p>No avatar.</p>
                )}
            </div>

            <div className="upload-container">
                <label className="label-upload-avatar">Change your Avatar:</label>
                <input
                    type="file"
                    id="file-upload"
                    className="input-text"
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) {
                            setAvatarFile(e.target.files[0]);
                        }
                    }}
                />
                <label htmlFor="file-upload" className="custom-file-label">
                    {avatarFile ? avatarFile.name : 'Choose file'}
                </label>
            </div>
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <div className="profile-about-me-followers">
                <div className="followers">
                    <p className="follow-counter">300</p>
                    <p>Followers</p>
                </div>
                <div className="dash"> </div>
                <div className="following">
                    <p className="follow-counter">500</p>
                    <p>Following</p>
                </div>
            </div>
            <div className="profile-about-me-container">
                <h2>About me</h2>
                <p className="about-me-text">{profile?.about_me}</p>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
}

export default ProfilePage;
