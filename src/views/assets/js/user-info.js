$(document).ready(async () => {
  await getPaymentHistory();
});

const updateUserInfoBtn = document.querySelector('#updateUserBtn');
const deleteUserBtn = document.querySelector('#deleteUserBtn');
const deleteBtn = document.querySelector('#deleteBtn');
const cancelBtn = document.querySelector('#cancelBtn');
const deleteDiv = document.querySelector('#deleteDiv');
const deleteUserDiv = document.querySelector('#deleteUserDiv');
const changePasswordBtn = document.querySelector('#changePasswordBtn');
const sendBtn = document.querySelector('#sendBtn');
const phoneAuthBtn = document.querySelector('#phoneAuthBtn');
const cancelAuthBtn = document.querySelector('#cancelAuthBtn');
const editBtn = document.querySelector('#editBtn');
const cancelAuthBtn2 = document.querySelector('#cancelAuthBtn2');
const paymentHistory = document.querySelector('#payment-history-table');

function updateUserInfo() {
  const email = document.querySelector('#email45').value;
  const name = document.querySelector('#name1').value;
  const payload = { email, name };

  $.ajax({
    method: 'PATCH',
    url: '/users',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
    },
    data: JSON.stringify(payload),
    success: (data) => {
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        icon: 'success',
        title: 'Success',
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
      return;
    },
    error: (error) => {
      console.log(error);
      if (error.responseJSON.message) {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'Error',
          text: error.responseJSON.message[0],
        });
      } else {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'Error',
          text: error.responseJSON,
        });
      }
      return;
    },
  });
}

// 삭제 확인 모달
function deleteConfirmModal(targetId, targetId2, targetType) {
  const confirmModal = document.querySelector('#modal-info-confirmed');
  $(confirmModal).modal('show');

  const okBtn = confirmModal.querySelector('.btn-info');
  const cancelBtn = confirmModal.querySelector('.btn-light');

  okBtn.addEventListener('click', () => {
    if (targetType === 'payment') {
      cancelPayment(targetId, targetId2);
    } else {
      deleteUser();
    }
    $(confirmModal).modal('hide');
  });

  cancelBtn.addEventListener('click', () => {
    $(confirmModal).modal('hide');
  });
}

function deleteUser() {
  const password = document.querySelector('#passwordInput').value;
  const payload = { password };
  $.ajax({
    method: 'DELETE',
    url: '/users',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
    },
    data: JSON.stringify(payload),
    success: (data) => {
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        icon: 'success',
        title: 'Success',
        text: data.message,
      }).then(() => {
        window.location.href = '/';
      });
      return;
    },
    error: (error) => {
      console.log(error);
      if (error.responseJSON.message) {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'Error',
          text: error.responseJSON.message[0],
        });
      } else {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'Error',
          text: error.responseJSON,
        });
      }
    },
  });
}

function changePassword() {
  const currentPassword = document.querySelector('#passwordInput2').value;
  const newPassword = document.querySelector('#confirmPasswordInput').value;
  const payload = { currentPassword, newPassword };

  $.ajax({
    method: 'PATCH',
    url: '/users/password',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
    },
    data: JSON.stringify(payload),
    success: (data) => {
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        icon: 'success',
        title: 'Success',
        text: data.message,
      }).then(() => {
        window.location.href = '/';
      });
      return;
    },
    error: (error) => {
      console.log(error);
      if (error.responseJSON.message) {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'Error',
          text: error.responseJSON.message[0],
        });
      } else {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'Error',
          text: error.responseJSON,
        });
      }
      return;
    },
  });
}

function send() {
  let phoneNumber = document.querySelector('#phoneNumberInput').value;
  phoneNumber = phoneNumber.split('-').join('');
  let code, expireTime, number;
  const payload = { phoneNumber };
  $.ajax({
    method: 'POST',
    url: 'sms',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
    },
    data: JSON.stringify(payload),
    success: (data) => {
      [code, expireTime] = [data.code, data.expireTime];
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        icon: 'success',
        title: 'Success',
        text: data.message,
      });
      sendBtn.style.display = 'none';
      number = phoneNumber;
      document.querySelector('#phoneNumberInput').readOnly = true;
      document.querySelector('#phoneAuthDiv').style.display = 'block';
      return;
    },
    error: (error) => {
      console.log(error);
      if (error.responseJSON.message) {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'Error',
          text: error.responseJSON.message[0],
        });
      } else {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'Error',
          text: error.responseJSON,
        });
      }
      return;
    },
  });

  phoneAuthBtn.addEventListener('click', () => {
    const verifyCode = document.querySelector('#phoneAuthInput').value;
    if (verifyCode === code && Date.now() < expireTime) {
      const payload = { phoneNumber: number };
      $.ajax({
        method: 'POST',
        url: '/users/phoneAuthentication',
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Content-type', 'application/json');
          xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
        },
        data: JSON.stringify(payload),
        success: (data) => {
          Swal.fire({
            customClass: {
              container: 'my-swal',
            },
            icon: 'success',
            title: 'Success',
            text: data.message,
          }).then(() => {
            window.location.reload();
          });
        },
        error: (error) => {
          Swal.fire({
            customClass: {
              container: 'my-swal',
            },
            icon: 'error',
            title: 'Error',
            text: error.responseJSON.message,
          });
        },
      });
    } else if (verifyCode !== code && Date.now() < expireTime) {
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        icon: 'error',
        title: 'Error',
        text: '인증번호가 다릅니다. 인증번호를 다시 확인해 주세요. ',
      });
      document.querySelector('#phoneAuthInput').value = '';
      return;
    } else {
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        icon: 'error',
        title: 'Error',
        text: '인증시간이 초과되었습니다. 처음부터 다시 시도해 주세요. ',
      }).then(() => {
        window.location.reload();
      });
      return;
    }
  });
}

async function changeProfileImage() {
  const form = new FormData();
  const img = document.querySelector('#file-upload').files[0];

  if (img) {
    if (img.size > 5 * 1024 * 1024) {
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        icon: 'error',
        title: 'Error',
        text: '5MB이하의 이미지 파일만 업로드 가능합니다.',
      });
      return;
    }
    form.append('newFile', img);
  }
  await $.ajax({
    method: 'PATCH',
    url: '/users/updateProfileImage',
    processData: false,
    contentType: false,
    data: form,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
    },
    success: () => {
      window.location.reload();
    },
    error: (error) => {
      console.error(error);
      Swal.fire({
        customClass: {
          container: 'my-swal',
        },
        icon: 'error',
        title: 'Error',
        text: error.responseJSON,
      }).then(() => {
        window.location.reload();
      });
      return;
    },
  });
}

updateUserInfoBtn.addEventListener('click', updateUserInfo);
deleteUserBtn.addEventListener('click', () => {
  deleteConfirmModal();
});
deleteBtn.addEventListener('click', () => {
  deleteDiv.style = 'display: none';
  deleteUserDiv.style = 'display: inline-flex; width: 100%';
});
cancelBtn.addEventListener('click', () => {
  deleteDiv.style = 'display: inline-flex; width: 100%';
  deleteUserDiv.style = 'display: none; ';
});
changePasswordBtn.addEventListener('click', changePassword);
sendBtn.addEventListener('click', send);
if (cancelAuthBtn) {
  cancelAuthBtn.addEventListener('click', () => {
    document.querySelector('#phoneNumberInput').readOnly = false;
    document.querySelector('#phoneAuthDiv').style.display = 'none';
    sendBtn.style.display = 'block';
    document.querySelector('#phoneNumberInput').value = '';
  });
}
if (cancelAuthBtn2) {
  cancelAuthBtn2.addEventListener('click', () => {
    window.location.reload();
  });
}
editBtn.addEventListener('click', () => {
  document.querySelector('#phoneNumberInput').readOnly = false;
  document.querySelector('#editBtnDiv').style.display = 'none';
  sendBtn.style.display = 'block';
});

// 결제내역 조회
async function getPaymentHistory() {
  try {
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1); // 현재 날짜에서 한달을 뺀 날짜

    await $.ajax({
      method: 'GET',
      url: `/users/payments/history`,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
      },
      success: (data) => {
        result = '';
        data.forEach((history) => {
          const paymentDate = new Date(history.paymentCreatedAt);
          if (paymentDate >= oneMonthAgo && paymentDate <= currentDate) {
            if (!history.membershipCreatedAt) {
              result += ` <tbody>
                            <tr>
                              <td data-workspace-id="${history.workspaceId}" id="workspace-name-table">${history.workspaceName}</td>
                              <td>취소된 결제입니다.</td>
                              <td>-</td>
                              <td>`;
            } else {
              result += ` <tbody>
                          <tr>
                            <td data-workspace-id="${history.workspaceId}" id="workspace-name-table">${
                              history.workspaceName
                            }</td>
                            <td>${history.membershipCreatedAt.substring(0, 10).replace('-', '.')} ~ 
                                ${history.membershipEndDate.substring(0, 10).replace('-', '.')}</td>
                            <td>${history.membershipPrice.toLocaleString()}원</td>
                            <td>
                              <div class="dropdown">
                                <a
                                  role="button"
                                  id="products"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                >
                                  <img src="./assets/img/svg/more-horizontal.svg" alt="more-horizontal" class="svg" />
                                </a>`;
            }
            result += ` <div class="dropdown-menu dropdown-menu-right" aria-labelledby="products">
                                  <a class="dropdown-item" style="cursor: pointer" data-payment-id="${history.paymentId}" id="cancel-payment-btn">결제 취소</a>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>`;
          }
        });
        paymentHistory.innerHTML += result;

        const cancelPaymentBtn = document.querySelectorAll('#cancel-payment-btn');
        cancelPaymentBtn.forEach((btn) => {
          const paymentId = btn.getAttribute('data-payment-id');
          const workspaceId = btn.closest('tr').querySelector('[data-workspace-id]').getAttribute('data-workspace-id');

          btn.addEventListener('click', () => {
            cancelPayment(paymentId, workspaceId);
          });
        });
      },
    });
  } catch (err) {
    console.error(err);
  }
}

// 결제 취소
async function cancelPayment(paymentId, workspaceId) {
  console.log(paymentId);
  console.log(workspaceId);
  try {
    await $.ajax({
      method: 'DELETE',
      url: `/workspaces/${workspaceId}/payments/${paymentId}`,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('authorization', `Bearer ${accessToken}`);
      },
      success: (data) => {
        console.log(data);
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'success',
          title: '결제 취소 완료!',
          text: `잔여일 : ${data.remainingDays}일, 
                 환불금액 : ${data.roundedRefundPrice.toLocaleString()}원`,
        }).then(() => {
          window.location.reload();
        });
      },
      error: (err) => {
        Swal.fire({
          customClass: {
            container: 'my-swal',
          },
          icon: 'error',
          title: 'error',
          text: err.responseJSON.message,
        });
      },
    });
  } catch (err) {
    console.error(err);
  }
}
