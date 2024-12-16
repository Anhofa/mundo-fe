import React, { useState , useEffect} from 'react';
import randomatic from 'randomatic';
import style from './Login.module.css'; 
// import { useAuth } from '../../context/AuthContext.tsx';
import { loginUser, getWechatLoginQR, checkWechatLoginCallback,bindEmail,checkHelperLoginCallback,verifyEmail } from '../../router/api'; // 导入登录函数
// import { useHistory } from 'react-router-dom'; // React Router 的 hook，确保在登录成功后跳转到其他页面
import { useNavigate,useSearchParams,Link,useLocation } from 'react-router-dom';
import { AxiosError } from 'axios'; // 导入 AxiosError 类型
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [ticket, setTicket] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('等待扫码...');
  const [polling, setPolling] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [bind,setBind]=useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [token1, setToken1] = useState<string | null>(null);
  const code = searchParams.get('code'); // 从 URL 获取 code
  const state = searchParams.get('state'); // 从 URL 获取 state
  const emailbind =searchParams.get('email'); // 从 URL 获取 email
  // 获取二维码
  const fetchQRCode = async () => {
    try {
      const data = await getWechatLoginQR();
      setTicket(data.data.ticket);
      setStatus('请使用微信扫码登录');
      setQrCodeUrl(`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${encodeURIComponent(data.data.ticket)}`);
      console.log('二维码获取成功:', data);
      console.log('QRURL', qrCodeUrl);
      // startPolling(); // 获取二维码后开始轮询登录状态
    } catch (error) {
      setStatus('获取二维码失败，请刷新重试');
      console.error('获取微信二维码失败:', error);
    }
  };
  // 监听 ticket 的变化，一旦 ticket 更新，启动轮询
  // useEffect(() => {
  //   if (ticket) {
  //     startPolling(); // ticket 更新后开始轮询
  //   }
  // }, [ticket]); // 依赖 ticket，ticket 更新时执行
  // useEffect(() => {
  //   // 监听 qrCodeUrl 的变化
  //   if (qrCodeUrl) {
  //     console.log('最新的 QRURL:', qrCodeUrl);
  //   }
  // }, [qrCodeUrl]);  // 依赖 qrCodeUrl，当其变化时执行
  // 开启轮询检查扫码登录状态
  useEffect(() => {
    // 从 URL 获取 token 参数
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get('token');
    
    // 只有当 token 为空时才更新状态，避免重复设置
    if (tokenFromUrl && token !== tokenFromUrl) {
      setToken(tokenFromUrl); // 设置 token 状态
    }
  }, [location.search, token]); // 依赖 location.search 和 token

  // 使用 useEffect 来监听 token1 的变化
  useEffect(() => {
    if (token1) {
      console.log("更新后的 token1:", token1);
    }
  }, [token1]); // 每次 token1 更新时，执行此副作用

  const startPolling = () => {
    if (polling || !ticket) return;
  
    setPolling(true);
    setStatus('正在检查登录状态...');
    const id = setInterval(async () => {
      try {
        const result = await checkWechatLoginCallback(ticket);
        console.log('轮询结果:', result);
        if (result.code === 200) {
          setStatus('登录成功！');
          navigate('/qanda');
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
        } else if (result.code === 400) {
          setStatus('等待用户扫码或确认...');
        }
      } catch (error) {
        // 使用类型断言将 error 转换为 AxiosError 类型
        const axiosError = error as AxiosError;
        console.log('bind',bind);
        console.log('data',axiosError.response.data.data.code);
        // 确保 response 和 data 存在后再访问 code
        if (axiosError.response?.data?.data.code === 400001) {
          setBind(true);
          navigate('/bindregister'); // 使用 navigate() 进行路由跳转
        } else {
          setStatus('检查登录状态失败，请稍后重试');
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
          console.error('检查扫码登录状态失败:', error);
        }
      }
    }, 3000);  // 这里结束了 setInterval 的定义
  
    setIntervalId(id);  // 设置 intervalId
  };
  
  // // 类型保护函数，判断 error 是否是 AxiosError 类型
  // const isAxiosError = (error: unknown): error is AxiosError => {
  //   return (error as AxiosError).isAxiosError !== undefined;
  // };
  // 清理轮询
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  // 监听 helper 回传
  const startPollingHelper = () => {
    if (polling || !state || !code ) return;
    
    setPolling(true);
    setStatus('正在检查登录状态...');
    const id = setInterval(async () => {
      try {
        console.log('state',state,'code',code);
        const result = await checkHelperLoginCallback(state, code);
        console.log('轮询结果:', result);
        if (result.code === 200) {
          setStatus('登录成功！');
          navigate('/qanda');
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
        } else if (result.code === 400) {
          setStatus('等待用户鉴权确认...');
        }
      } catch (error) {
        // 使用类型断言将 error 转换为 AxiosError 类型
        const axiosError = error as AxiosError;
        console.log('bind',bind);
        console.log('state',state,'code',code);
        console.log('data',axiosError.response.data.data.code);
        // 确保 response 和 data 存在后再访问 code
        if (axiosError.response?.data?.data.code === 400001) {
          setBind(true);
          navigate('/bindregister'); // 使用 navigate() 进行路由跳转
        } else {
          setStatus('检查登录状态失败，请稍后重试');
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
          console.error('检查扫码登录状态失败:', error);
        }
      }
    }, 3000);  // 这里结束了 setInterval 的定义
  
    setIntervalId(id);  // 设置 intervalId
  };
  // 监听 helper 回传
  useEffect(() => {
    if (code && state && state === '1a') {
      console.log('code:', code);
      console.log('state:', state);

      // 确保 code 和 state 都存在
      if (code && state) {
        startPollingHelper();
      } else {
        setStatus('缺少必要的参数');
      }
    }
  }, [code, state]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

//   const handleLogin = () => {
//     // Implement login logic here
//     console.log('Email:', email);
//     console.log('Password:', password);
//   };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = await loginUser(email, password); // 调用登录函数
      console.log('登录成功:', data);
      navigate('/qanda');
    } catch (err) {
      setError('登录失败，请检查您的电子邮件和密码');
    }
  };

//   // 邮箱验证登录,激活邮箱
//   const handleVerify = async () => {
//     if (!emailbind || !token) {
//       alert('缺少必要的信息，请检查链接或填写密码！');
//       return null;
//     }
  
//     const randomString = randomatic('a0', 6);
  
//     try {
//       // 调用 verifyEmail，并获取返回的新 token
//       const newData = await verifyEmail(emailbind, token, randomString);
//       console.log('新 token:', newData.data.token);
//       setToken1(newData.data.token); // 更新 token
//       console.log("token1",token1);
//       // alert('邮箱激活成功！');
//       return newData.data.token;
//     } catch (error) {
//       console.error('激活失败:', error);
//       alert('激活失败，请稍后再试！');
//       null;
//     }
// };
//   const bindLogin = async () => {
//     try {
//       const aaa = await handleVerify(); // 确保 handleVerify 完成后再继续
//       // 等待 2 秒
//       // await new Promise((resolve) => setTimeout(resolve, 2000));

//       if (token1) {
//         const data = await bindEmail(aaa); // 调用绑定邮箱函数
//         console.log('绑定邮箱成功:', data);
//         navigate('/qanda');
//       } else {
//         setStatus('token1 无效，请检查链接或重新激活邮箱');
//       }

//     } catch (error) {
//       setStatus('绑定邮箱失败，请刷新重试');
//       console.error('绑定邮箱失败:', error);
//     }
//   };
  // 邮箱验证登录, 激活邮箱
const handleVerify = () => {
  return new Promise((resolve, reject) => {
    if (!emailbind || !token) {
      alert('缺少必要的信息，请检查链接或填写密码！');
      reject('缺少必要的信息');
      return;
    }

    const randomString = randomatic('a0', 6);

    // 调用 verifyEmail，并获取返回的新 token
    verifyEmail(emailbind, token, randomString)
      .then((newData) => {
        console.log('新 token:', newData.data.token);
        setToken1(newData.data.token); // 更新 token
        console.log("token1", token1); // 这儿还会是之前的 token, 因为 setState 是异步的
        resolve(newData.data.token); // 返回新 token
      })
      .catch((error) => {
        console.error('激活失败:', error);
        alert('激活失败，请稍后再试！');
        reject('激活失败');
      });
  });
};

const bindLogin = () => {
  handleVerify()
    .then((newToken) => {
      // 等待 2 秒
      new Promise((resolve) => setTimeout(resolve, 2000))
        .then(() => {
          if (newToken) {
            return bindEmail(newToken); // 调用绑定邮箱函数
          } else {
            setStatus('token1 无效，请检查链接或重新激活邮箱');
            return Promise.reject('token1 无效');
          }
        })
        .then((data) => {
          console.log('绑定邮箱成功:', data);
          navigate('/qanda');
        })
        .catch((error) => {
          setStatus('绑定邮箱失败，请刷新重试');
          console.error('绑定邮箱失败:', error);
        });
    })
    .catch((error) => {
      setStatus('绑定邮箱失败，请刷新重试');
      console.error('激活失败或 token 无效:', error);
    });
};

  const handleHelperLogin = () => {
    const url=`https://api.hduhelp.com/oauth/authorize?response_type=code&client_id=jvbarBgwFKD78LMh&redirect_uri=http://localhost:5173/login&state=1a`
    window.location.href=url;//当前窗口打开
    // window.open(url,'_blank');//新窗口打开
  }
  return (
    <div className={style.loginBox}>
        <h2 className={style.loginTitle}>Mundo 登录</h2>
        <div className={style.inputGroup}>
            <label htmlFor="email">邮箱：</label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="请输入邮箱"
            required
            />
        </div>
        <div className={style.inputGroup}>
            <label htmlFor="password">密码：</label>
            <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="请输入密码"
            required
            />
        </div>
        <button className={style.loginBtn} onClick={handleLogin}>登录</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className={style.otherLogin}>
            <button className={style.loginOption}>邮箱验证登录</button>
            <button className={style.loginOption}>手机号登录</button>
            <button className={style.loginOption} onClick={fetchQRCode}>微信登录</button>
            <button className={style.loginOption} onClick={handleHelperLogin}>HDUHelper登录</button>
        </div>
        {qrCodeUrl ? (
          <div>
            <p>{status}</p>
            <img src={qrCodeUrl} alt="微信登录二维码" style={{ width: '200px', height: '200px' }} />
            {!polling && <button onClick={startPolling}>开始检查登录状态</button>}
          </div>
        ) : (
          <p>{status}</p>
        )}
        <button className={style.loginOption} onClick={bindLogin}>邮箱绑定</button>
        <p className={style.registerLink}>还没有账号？<Link to="/register">去注册</Link></p>

    </div>
  );
};

export default Login;
