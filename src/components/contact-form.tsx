import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const FIRST_STEP = 1;
const LAST_STEP = 4;

interface FormState {
  step: number;
  name: string;
  email: string;
  description: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    step: FIRST_STEP,
    name: "",
    email: "",
    description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  const isLastStep = useMemo(() => form.step === LAST_STEP, [form.step]);

  const handleVisibleSpan = () => {
    spanRef.current?.classList.replace("hidden", "inline-block");
  };

  const handleFocusOnInput = () => {
    inputRef.current?.focus();
  };

  const handleNextStep = () => {
    setForm((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  const handleRestart = () => {
    setForm({ step: FIRST_STEP, name: "", email: "", description: "" });
    setIsSubmitted(false);
  };

  const handleSend = () => {
    alert("Form submitted!");
    setIsSubmitted(true);
  };

  const handleClick = () => {
    handleVisibleSpan();
    handleFocusOnInput();
  };

  useEffect(() => {
    if (form.step === FIRST_STEP) return;
    handleClick();
  }, [form.step]);

  const renderInputField = (
    label: string,
    value: string,
    onChange: (value: string) => void
  ) => (
    <>
      <Input
        ref={inputRef}
        type="text"
        className="sr-only"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleNextStep()}
      />
      <p>
        <span className="text-emerald-400">➜</span>{" "}
        <span className="text-cyan-300">~</span>{" "}
        <span className="opacity-50 pr-2">Enter {label}</span>
        {value}
        <span
          ref={spanRef}
          className="mx-1 hidden h-5 w-2 translate-y-1 bg-slate-400 animate-pulse"
        ></span>
      </p>
    </>
  );

  const renderCompletedField = (value: string) => (
    <p className="text-emerald-300">
      <CheckIcon />
      <span>{value}</span>
    </p>
  );

  return (
    <section className="bg-[url('/terminal.webp')] h-screen w-full flex items-center justify-center bg-cover bg-center">
      <div
        onClick={handleClick}
        className="mx-1 md:mx-auto h-[500px] w-full max-w-3xl cursor-text overflow-y-auto rounded-lg bg-slate-950/70 font-mono shadow-xl backdrop-blur-3xl"
      >
        <TerminalHeader />
        <div className="p-2 text-lg text-slate-100">
          <p>Hey there! We're excited to link 🔗</p>
          <p className="overflow-hidden whitespace-nowrap font-light">
            ------------------------------------------------------------------------
          </p>

          {/* Email Step */}
          <div>
            <p>
              To start, could you give us{" "}
              <span className="text-violet-300">your email?</span>
            </p>
            {form.step === FIRST_STEP
              ? renderInputField("email", form.email, (value) =>
                  setForm((prev) => ({ ...prev, email: value }))
                )
              : form.step > FIRST_STEP && renderCompletedField(form.email)}
          </div>

          {/* Name Step */}
          {form.step >= 2 && (
            <div>
              <p>
                Awesome! And what's{" "}
                <span className="text-violet-300">your name?</span>
              </p>
              {form.step === 2
                ? renderInputField("name", form.name, (value) =>
                    setForm((prev) => ({ ...prev, name: value }))
                  )
                : form.step > 2 && renderCompletedField(form.name)}
            </div>
          )}

          {/* Description Step */}
          {form.step >= 3 && (
            <div>
              <p>
                Perfect, and{" "}
                <span className="text-violet-300">how can we help you?</span>
              </p>
              {form.step === 3
                ? renderInputField("description", form.description, (value) =>
                    setForm((prev) => ({ ...prev, description: value }))
                  )
                : form.step > 3 && renderCompletedField(form.description)}
            </div>
          )}

          {/* Results and Buttons */}
          {isLastStep && (
            <>
              <ShowResult
                name={form.name}
                email={form.email}
                description={form.description}
              />
              {!isSubmitted && (
                <Buttons onRestart={handleRestart} onSend={handleSend} />
              )}
            </>
          )}

          {isSubmitted && (
            <p className="text-emerald-300">
              <CheckIcon />
              <span>Sent! We'll get back to you ASAP 😎</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function TerminalHeader() {
  return (
    <div className="sticky top-0 flex w-full items-center gap-1 bg-slate-900 p-3">
      <div className="h-3 w-3 rounded-full bg-red-500"></div>
      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
      <div className="h-3 w-3 rounded-full bg-green-500"></div>
      <span className="absolute left-[50%] -translate-x-[50%] text-sm font-semibold text-slate-200">
        Contact Form
      </span>
    </div>
  );
}

interface ShowResultProps extends Omit<FormState, "step"> {}

function ShowResult({ email, name, description }: ShowResultProps) {
  return (
    <>
      <p>
        <span className="text-blue-300">email:</span> {email}
      </p>
      <p>
        <span className="text-blue-300">name:</span> {name}
      </p>
      <p>
        <span className="text-blue-300">description:</span> {description}
      </p>
      <p>Look good?</p>
    </>
  );
}

interface ButtonsProps {
  onRestart: () => void;
  onSend: () => void;
}

function Buttons({ onRestart, onSend }: ButtonsProps) {
  return (
    <div className="mt-2 flex gap-2">
      <Button onClick={onRestart} className="bg-slate-100 text-black">
        Restart
      </Button>
      <Button onClick={onSend} className="bg-indigo-500 text-white">
        Send it!
      </Button>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 inline-block"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
