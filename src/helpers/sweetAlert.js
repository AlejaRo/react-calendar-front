import Swal from 'sweetalert2';

export const swalSuccess = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'success',
  });
};

export const swalError = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'error',
  });
};
