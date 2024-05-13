'use client';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';
import AuthModal from '../components/AuthModal';
import AuthType from '@/types/authType';

export default function SignIn() {
  return <AuthModal type={AuthType.SIGN_IN} />;
}
