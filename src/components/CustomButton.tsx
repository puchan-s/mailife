"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';

type Props = {
    routePath:string,
    context: string
}


const CustomButton: React.FC<Props> = ({ routePath ,context }) => {
  const router = useRouter();

  const handleClick = () => {
    // 移動先のパスを指定
    router.push('/'+routePath);
  };

  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      {context}
    </Button>
  );
};

export default CustomButton;
