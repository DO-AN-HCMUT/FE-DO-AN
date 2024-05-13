'use client';

import AuthModal from '../components/AuthModal';
import AuthType from '@/types/authType';

export default function SignIn() {
  return <AuthModal type={AuthType.SIGN_UP} />;
}
