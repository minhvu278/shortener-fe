import { api } from '@/utils/api';
import { redirect } from 'next/navigation';

export default async function RedirectPage({ params }: { params: { shortCode: string } }) {
  try {
    const response = await api.get(`/links/${params.shortCode}`);
    if (response.data.originalUrl) {
      redirect(response.data.originalUrl);
    }
  } catch (error) {
    redirect('/');
  }
}
