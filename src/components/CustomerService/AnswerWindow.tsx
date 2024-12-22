import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import QuestionList from "./QuestionList";
import { QQLink } from "./QQLink";
import AIChat from "./AiChat";
import styles from "./AnswerWindow.module.css";
import CustomerServiceButton from "@/components/CustomerService/CustomerServiceButton";
// import TypingAnimation from "@/components/ui/typing-animation";
import BlurIn from "@/components/ui/blur-in";
import { ConfettiButton } from "@/components/ui/confetti";
import  HumanChat  from "./HumanChat";

const AnswerWindow: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const windowRef = useRef(null);
  const toggleWindow = () => {
    setIsOpen((prev) => !prev); // 切换客服答案窗口的显示和隐藏
  };

  useEffect(() => {
    //被渲染后调用钩子，执行动画
    if (isOpen && windowRef.current) {
      // 使用 GSAP 动画让窗口从下方滑入，透明度从 0 到 1，位置从 50px 到 0
      gsap.from(windowRef.current, { opacity: 0, y: 50, duration: 0.5 });
      // 确保在动画结束时，元素的透明度为 1，位置为 0
      gsap.to(windowRef.current, { opacity: 1, y: 0, duration: 0.5 });
    }
  }, [isOpen]);

  return (
    <div>
      <CustomerServiceButton onClick={toggleWindow} />
      {isOpen && (
        <div ref={windowRef} className={styles.answerWindow}>
          <header className="mt-40">
            <BlurIn
              className={styles.answerWindow_title}
              word="有问题，就有答案"
              duration={0.75}
            />
          </header>
          <main className={styles.box_styles_contain}>
            <section>
              {/* <QuestionList /> */}
            </section>
            <section>
              <AIChat />
            </section>
            <section>
              <HumanChat />
            </section>
          </main>
          <footer className="mt-5 w-full flex justify-start">
            <QQLink />
          </footer>
          <footer className="mt-5 w-full flex justify-start">
            <ConfettiButton
              options={{
            get angle() {
              return Math.random() * 360;
            },
              }}
            >
              找到答案就庆祝一下吧 🎉
            </ConfettiButton>
          </footer>
        </div>
      )}
    </div>
  );
};

export default AnswerWindow;
