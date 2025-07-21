import Swal, { SweetAlertIcon } from 'sweetalert2'

export class ErrorService {

  static successMessage = (title: string, msg: string) => {
      return Swal.fire({
          title: `<span style="background: linear-gradient(90deg, #3b82f6, #a21caf); -webkit-background-clip: text; color: transparent; font-weight: bold;">${title}</span>`,
          html: `<span style="color: #d1d5db;">${msg}</span>`,
          icon: "success",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#6366f1",
          customClass: {
            popup: 'rounded-2xl shadow-2xl border border-gray-700/50',
            confirmButton: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg px-6 py-2',
            title: 'text-2xl',
            htmlContainer: 'text-base',
          },
        });
  }

  static errorMessage = (title: string, msg: string) => {
      return Swal.fire({
          title: `<span style="background: linear-gradient(90deg, #ef4444, #a21caf); -webkit-background-clip: text; color: transparent; font-weight: bold;">${title}</span>`,
          html: `<span style="color: #fca5a5;">${msg}</span>`,
          icon: "error",
          background: "#1e293b",
          color: "#fff",
          confirmButtonColor: "#ef4444",
          customClass: {
            popup: 'rounded-2xl shadow-2xl border border-gray-700/50',
            confirmButton: 'bg-gradient-to-r from-red-600 to-purple-600 text-white font-medium rounded-lg px-6 py-2',
            title: 'text-2xl',
            htmlContainer: 'text-base',
          },
      });
  }

  static infoMessage = (title: string, msg: string) => {
    return Swal.fire({
        title: `<span style="background: linear-gradient(90deg, #3b82f6, #a21caf); -webkit-background-clip: text; color: transparent; font-weight: bold;">${title}</span>`,
        html: `<span style="color: #a5b4fc;">${msg}</span>`,
        icon: "info",
        background: "#1e293b",
        color: "#fff",
        confirmButtonColor: "#6366f1",
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-gray-700/50',
          confirmButton: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg px-6 py-2',
          title: 'text-2xl',
          htmlContainer: 'text-base',
        },
      });
  }

  static mixinMessage = (msg: string, icon: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: "#1e293b",
      color: "#fff",
      customClass: {
        popup: 'rounded-xl shadow-lg border border-gray-700/50',
        title: 'text-base',
      },
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    return Toast.fire({
      icon: icon as SweetAlertIcon | undefined,
      title: `<span style="background: linear-gradient(90deg, #3b82f6, #a21caf); -webkit-background-clip: text; color: transparent; font-weight: bold;">${msg}</span>`
    });
  }

  static infoField = (title: string, inputLabel: string, inputPlaceholder: string) => {
    return Swal.fire({
      title: `<span style="background: linear-gradient(90deg, #3b82f6, #a21caf); -webkit-background-clip: text; color: transparent; font-weight: bold;">${title}</span>`,
      input: 'text',
      inputLabel: inputLabel,
      inputPlaceholder: inputPlaceholder,
      showCancelButton: true,
      background: "#1e293b",
      color: "#fff",
      confirmButtonColor: "#6366f1",
      customClass: {
        popup: 'rounded-2xl shadow-2xl border border-gray-700/50',
        confirmButton: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg px-6 py-2',
        title: 'text-2xl',
        htmlContainer: 'text-base',
      },
    })
  }

}