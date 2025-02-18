import Breadcrumb from '@/components/bread-crumb';
import Container from '@/components/container';
import Title from '@/components/ui/title';
import { UserTypes } from '@/helpers/types';
import { useEffect, useRef, useState } from 'react';
import FormContainer from './form-container';
import { accountForm, addressForm, personalForm } from './forms-data';
import { Label } from '@/components/ui/label';
import SelectInput from '@/components/reusable-select';
import { Input } from '@/components/ui/input';
import { handleFileChange } from '@/helpers/file-upload';
import { useAuth } from '@/stores/AuthContext';
import { getAllUser, registerUserByAdmin } from '@/api/get.info.api';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useFetchAndDispatch } from '@/helpers/useFetch';

const NewUser = () => {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'User', href: '/users' },
    { label: 'new', isCurrentPage: true },
  ];
  const { user, allUser } = useAuth();
  const [userData, setUserData] = useState<UserTypes>({
    password: '',
    status: true,
    role: 'user',
    userId: '',
    _id: '',
    email: '',
    profile: 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png',
    personalData: {
      firstName: '',
      lastName: '',
      middleName: '',
      birthday: '',
      birthplace: '',
      address: {
        streetAddress: '',
        city: '',
        state: '',
        zipcode: '',
        latitude: 0,
        longitude: 0,
      },

      age: 0,
      sex: '',
      civilStatus: '',
      contact: '',
      citizenship: '',
    },
  });

  const item = useLocation();
  const { state } = item;

  useFetchAndDispatch(getAllUser, 'GET_ALL_USER');

  useEffect(() => {
    if (state?.isEdit) {
      const searchParams = new URLSearchParams(item.search);

      const myParamValue = searchParams.get('');
      if (!myParamValue) return;
      const items = allUser.find((x) => x._id === myParamValue) as UserTypes;
      if (!items) return;

      setUserData({ ...items, personalData: items.personalData });
    }
  }, [allUser, item.search, state?.isEdit]);

  const inputRef = useRef(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedUrl = await handleFileChange(e);
    if (uploadedUrl) {
      setUserData((prev) => ({
        ...prev,
        ['profile']: uploadedUrl,
      }));
    }
  };

  const onInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? Number(value) || 0 : value;

    if (name in userData.personalData) {
      setUserData((prev) => ({
        ...prev,
        personalData: {
          ...prev.personalData,
          [name]: parsedValue,
        },
      }));
    } else if (name in userData.personalData.address) {
      setUserData((prev) => ({
        ...prev,
        personalData: {
          ...prev.personalData,
          address: {
            ...prev.personalData.address,
            [name]: parsedValue,
          },
        },
      }));
    } else {
      setUserData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  const { dispatch } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      console.log();
      const res = await registerUserByAdmin({
        ...userData,
        password: new Date(userData.personalData.birthday as string).toISOString().split('T')[0],
      });

      if (res.success === false) return toast.error(res.data?.msg || 'Error');
      toast.success(res.msg);
      dispatch({ type: 'ADD_USER', payload: res });
      setTimeout(() => {
        navigate('/users');
      }, 1500);
    } catch (error) {
      console.log(error);
      toast.error('Please fill all the fields');
    }
  };

  return (
    <Container>
      <header className='inline-flex w-full justify-between pr-3'>
        <Title text='User' />
      </header>
      <Breadcrumb items={breadcrumbItems} />

      <section className='h-[calc(100vh-100px)] pb-24 overflow-y-auto'>
        <FormContainer title='Account Information'>
          <img
            src={userData.profile ? userData.profile : 'https://placehold.co/400'}
            className='h-16 w-16 rounded-full'
            onClick={() => {
              if (inputRef) {
                inputRef?.current.click();
              }
            }}
          />

          {accountForm.map((items) => (
            <div
              key={items.name}
              className='lg:w-full'
            >
              <Label> {items.label}</Label>

              {items.type === 'option' ? (
                <SelectInput
                  value={userData.role}
                  onValueChange={(val) => {
                    setUserData((prev) => ({
                      ...prev,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      ['role']: val as any,
                    }));
                  }}
                  options={['tenant', 'user', ...(user.role === 'admin' ? ['admin'] : [])]}
                  placeholder={'Account Access'}
                />
              ) : (
                <Input
                  type={items.type}
                  ref={items.type === 'file' ? inputRef : null}
                  name={items.name}
                  className={`${items.type === 'file' && 'hidden'}`}
                  onChange={items.type === 'file' ? onFileChange : onInputChange}
                  value={items.type === 'file' ? undefined : (userData[items.name] as keyof UserTypes as string)}
                />
              )}
            </div>
          ))}
        </FormContainer>

        <FormContainer title='Personal Information'>
          {personalForm.map((items) => (
            <div
              key={items.name}
              className='lg:w-[49%]'
            >
              <Label> {items.label}</Label>

              {items.type === 'option' ? (
                <SelectInput
                  value={userData.personalData.sex}
                  onValueChange={(val) => {
                    setUserData((prev) => ({
                      ...prev,
                      personalData: {
                        ...prev.personalData,
                        ['sex']: val,
                      },
                    }));
                  }}
                  options={['Male', 'Female', 'Unknown']}
                  placeholder={'Gender'}
                />
              ) : (
                <Input
                  type={items.type}
                  ref={items.type === 'file' ? inputRef : null}
                  name={items.name}
                  className={`${items.type === 'file' && 'hidden'}`}
                  onChange={onInputChange}
                  value={
                    items.type === 'file' ? undefined : (userData.personalData[items.name] as keyof UserTypes as string)
                  }
                />
              )}
            </div>
          ))}
        </FormContainer>

        <FormContainer title='Address Information'>
          {addressForm.map((items) => (
            <div
              key={items.name}
              className='lg:w-[49%]'
            >
              <Label> {items.label}</Label>

              <Input
                type={items.type}
                ref={items.type === 'file' ? inputRef : null}
                name={items.name}
                className={`${items.type === 'file' && 'hidden'}`}
                onChange={onInputChange}
                value={
                  items.type === 'file'
                    ? undefined
                    : (userData.personalData.address[items.name] as keyof UserTypes as string)
                }
              />
            </div>
          ))}
        </FormContainer>

        <div className='space-x-3 mt-4'>
          <Button onClick={handleSubmit}>Save</Button>
          <Button
            variant='destructive'
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </section>
    </Container>
  );
};

export default NewUser;
