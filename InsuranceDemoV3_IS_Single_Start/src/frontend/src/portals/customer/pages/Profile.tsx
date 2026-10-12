import React, { useState, useEffect } from 'react';
import avatar from '../../../assets/avatar.jpeg';
import { getCustomerById, updateCustomerById } from '../../../lib/api/customersApi';
import AddressInput from '../../../components/common/AddressInput';
import { useCustomer } from '../../../lib/auth/customerContext';
import {
  PageContainer,
  ProfileContainer,
  ProfileCard,
  ProfileHeaderSection,
  UserSection,
  Avatar,
  UserInfo,
  UserName,
  UserEmail,
  EditButton,
  CancelButton,
  SaveButton,
  ButtonGroup,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select
} from '../../../styles/customer/Profile.styled';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    customer_id: '',
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    created_at: '',
    status: '',
  });
  const [originalData, setOriginalData] = useState({ ...profileData });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);

  const { customerId } = useCustomer();

  useEffect(() => {
    const id = customerId || 'C_002';

    setLoading(true);
    getCustomerById(id)
      .then(res => {
        const c = res.data.Customer;
        const data = {
          customer_id: c.customer_id || '',
          first_name: c.first_name || '',
          last_name: c.last_name || '',
          dob: c.dob || '',
          gender: c.gender || '',
          email: c.email || '',
          phone: c.phone || '',
          address: c.address || '',
          created_at: c.created_at || '',
          status: c.status || '',
        };
        setProfileData(data);
        setOriginalData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch customer profile');
        setLoading(false);
      });
  }, [customerId]);

  const handleEdit = () => {
    setOriginalData({ ...profileData });
    setIsEditing(true);
    setIsAddressValid(null); 
  };

  const handleCancel = () => {
    setProfileData({ ...originalData });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (profileData.address.trim() !== "" && isAddressValid === false) {
      setError('Please enter a valid address');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await updateCustomerById(profileData.customer_id, {
        customer: {
          customer_id: profileData.customer_id,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          dob: profileData.dob,
          gender: profileData.gender,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          status: profileData.status
        }
      });
      setOriginalData({ ...profileData });
      setIsEditing(false);
    } catch {
      setError('Failed to update customer profile');
    } finally {
      setSaving(false);
    }
  };

  const fullName = `${profileData.first_name} ${profileData.last_name}`;

  if (loading) return <PageContainer>Loading...</PageContainer>;
  if (error) return <PageContainer>{error}</PageContainer>;

  return (
    <PageContainer>
      <ProfileContainer>
        <ProfileCard>
          <ProfileHeaderSection>
            <UserSection>
              <Avatar src={avatar} alt={fullName} />
              <UserInfo>
                <UserName>{fullName}</UserName>
                <UserEmail>{profileData.email}</UserEmail>
              </UserInfo>
            </UserSection>
            {!isEditing && <EditButton onClick={handleEdit}>Edit</EditButton>}
          </ProfileHeaderSection>

          <FormGrid>
            <FormGroup>
              <Label>First Name</Label>
              <Input 
                type="text" 
                value={profileData.first_name}
                onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                disabled={!isEditing}
                placeholder="Your First Name" 
              />
            </FormGroup>

            <FormGroup>
              <Label>Last Name</Label>
              <Input 
                type="text" 
                value={profileData.last_name}
                onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                disabled={!isEditing}
                placeholder="Your Last Name" 
              />
            </FormGroup>

            <FormGroup>
              <Label>Gender</Label>
              <Select 
                value={profileData.gender}
                onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                disabled={!isEditing}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Date Of Birth</Label>
              <Input 
                type="text" 
                value={profileData.dob}
                onChange={(e) => setProfileData({...profileData, dob: e.target.value})}
                disabled={!isEditing}
                placeholder="yyyy-mm-dd" 
              />
            </FormGroup>

            <FormGroup>
              <Label>Email</Label>
              <Input 
                type="email" 
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
                placeholder="Your Email" 
              />
            </FormGroup>

            <FormGroup>
              <Label>Phone</Label>
              <Input 
                type="tel" 
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                disabled={!isEditing}
                placeholder="Your Phone number" 
              />
            </FormGroup>

            <FormGroup>
              {isEditing ? (
                <AddressInput
                  id="address"
                  name="address"
                  value={profileData.address}
                  onChange={(value) => setProfileData({...profileData, address: value})}
                  label="Address"
                  required={false}
                  onValidationComplete={(isValid) => {
                    setIsAddressValid(isValid);
                  }}
                />
              ) : (
                <>
                  <Label>Address</Label>
                  <Input 
                    type="text" 
                    value={profileData.address}
                    disabled={true}
                    placeholder="Your Address" 
                  />
                </>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Input 
                type="text" 
                value={profileData.status}
                onChange={(e) => setProfileData({...profileData, status: e.target.value})}
                disabled
                placeholder="Status" 
              />
            </FormGroup>
          </FormGrid>
          
          {isEditing && (
            <ButtonGroup>
              <CancelButton onClick={handleCancel} disabled={saving}>Cancel</CancelButton>
              <SaveButton onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</SaveButton>
            </ButtonGroup>
          )}
        </ProfileCard>
      </ProfileContainer>
    </PageContainer>
  );
};

export default Profile;