import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { coursesAPI } from '../lib/courses';

export default function CourseDelete() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const deleteData = async () => {
      try {
        await coursesAPI.deleteCourse(Number(id));
        alert('Course berhasil dihapus.');
        navigate('/courses');
      } catch (error) {
        console.error('Gagal menghapus course:', error);
        alert('Terjadi kesalahan saat menghapus course.');
        navigate('/courses');
      }
    };

    deleteData();
  }, [id, navigate]);

  return (
    <div className="text-white text-center mt-20">
      <p>Menghapus course...</p>
    </div>
  );
}
