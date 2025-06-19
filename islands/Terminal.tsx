import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { JSX } from "preact";

interface TerminalOutput {
  command: string;
  output: string | JSX.Element;
  timestamp: Date;
}

const COMMANDS = {
  help: "Show available commands",
  about: "Learn about Terry Djony",
  projects: "Show my real projects",
  contact: "Get contact information",
  clear: "Clear the terminal",
  whoami: "Display current user",
  date: "Show current date and time",
  echo: "Echo back the input",
  ls: "List available sections",
  history: "Show command history",
  neofetch: "Show system information"
};

const ASCII_ART_FULL = `
████████╗███████╗██████╗ ██████╗ ██╗   ██╗    ██████╗      ██╗ ██████╗ ███╗   ██╗██╗   ██╗
╚══██╔══╝██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝    ██╔══██╗     ██║██╔═══██╗████╗  ██║╚██╗ ██╔╝
   ██║   █████╗  ██████╔╝██████╔╝ ╚████╔╝     ██║  ██║     ██║██║   ██║██╔██╗ ██║ ╚████╔╝ 
   ██║   ██╔══╝  ██╔══██╗██╔══██╗  ╚██╔╝      ██║  ██║██   ██║██║   ██║██║╚██╗██║  ╚██╔╝  
   ██║   ███████╗██║  ██║██║  ██║   ██║       ██████╔╝╚█████╔╝╚██████╔╝██║ ╚████║   ██║   
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═════╝  ╚════╝  ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   
`;

const ASCII_ART_MOBILE = `
████████╗███████╗██████╗ ██████╗ ██╗   ██╗
╚══██╔══╝██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
   ██║   █████╗  ██████╔╝██████╔╝ ╚████╔╝ 
   ██║   ██╔══╝  ██╔══██╗██╔══██╗  ╚██╔╝  
   ██║   ███████╗██║  ██║██║  ██║   ██║   
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
`;

export default function Terminal() {
  const isMobile = useSignal(false);
  
  const getASCIIArt = () => isMobile.value ? ASCII_ART_MOBILE : ASCII_ART_FULL;
  
  const output = useSignal<TerminalOutput[]>([
    {
      command: "init",
      output: `${getASCIIArt()}\nWelcome to Terry Djony's Terminal Portfolio!\nIndonesian YC W21 Alumni • Self-taught programmer • Tech Startup Entrepreneur (SaaS and AI)\nType 'help' for available commands.\n`,
      timestamp: new Date()
    },
    {
      command: "help",
      output: renderHelpCommand(),
      timestamp: new Date()
    }
  ]);
  
  const currentInput = useSignal("");
  const commandHistory = useSignal<string[]>([]);
  const historyIndex = useSignal(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  function renderHelpCommand() {
    return (
      <div>
        <div>Available commands:</div>
        {Object.entries(COMMANDS).map(([cmd, desc]) => (
          <div key={cmd} className="help-command-line">
            <span 
              className="clickable-command"
              onClick={() => executeCommand(cmd)}
              style={{
                color: "#4CAF50",
                cursor: "pointer",
                textDecoration: "underline",
                marginRight: "8px",
                minWidth: "96px",
                display: "inline-block"
              }}
            >
              {cmd}
            </span>
            <span> - {desc}</span>
          </div>
        ))}
      </div>
    );
  }

  function renderContactCommand() {
    return (
      <div>
        <div>Contact Information:</div>
        <br />
        <div>📧 Email: <a 
          href="mailto:hi@terrydjony.com" 
          style={{color: "#4CAF50", textDecoration: "underline"}}
          target="_blank"
        >hi@terrydjony.com</a></div>
        <div>🐙 GitHub:    <a 
          href="https://github.com/terryds" 
          style={{color: "#4CAF50", textDecoration: "underline"}}
          target="_blank" 
          rel="noopener noreferrer"
        >https://github.com/terryds</a></div>
        <div>🐦 Twitter:   <a 
          href="https://x.com/Terry_Djony" 
          style={{color: "#4CAF50", textDecoration: "underline"}}
          target="_blank" 
          rel="noopener noreferrer"
        >https://x.com/Terry_Djony</a></div>
      </div>
    );
  }

  useEffect(() => {
    // Focus input on load
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Check screen size and update mobile state
    const checkScreenSize = () => {
      const wasMobile = isMobile.value;
      isMobile.value = window.innerWidth <= 768;
      
      // If mobile state changed, update the welcome message
      if (wasMobile !== isMobile.value) {
        output.value = [
          {
            command: "init",
            output: `${getASCIIArt()}\nWelcome to Terry Djony's Terminal Portfolio!\nIndonesian YC W21 Alumni • Self-taught programmer • Tech Startup Entrepreneur (SaaS and AI)\nType 'help' for available commands.\n`,
            timestamp: new Date()
          },
          {
            command: "help",
            output: renderHelpCommand(),
            timestamp: new Date()
          }
        ];
      }
    };
    
    // Initial check
    checkScreenSize();
    
    // Listen for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const [command, ...args] = trimmedCmd.split(" ");
    
    // Add to history
    if (trimmedCmd) {
      commandHistory.value = [...commandHistory.value, trimmedCmd];
    }

    let result: string | JSX.Element = "";

    switch (command.toLowerCase()) {
      case "help":
        result = renderHelpCommand();
        break;

      case "about":
        result = `Hey there! 👋 I'm Terry Djony

🇮🇩 The First Indonesian Gen-Z at YCombinator Batch W21
🏠 Now based in Bandung, Indonesia
💻 Self-taught programmer since age 13
🎓 Former engineering physics student
🚀 Building in SaaS & AI
`;
        break;

      case "projects":
        result = `My Projects:

🤖 FirstSupport.ai (2024)
   └── QA Automation for Customer Support
   └── AI-powered customer service automation

💬 Chatbiz (2021)
   └── WhatsApp Chatbot Builder for Indonesia
   └── Serving millions of chats per month
   └── Used by telco, FMCG, hospitals, and more

🧪 SnipSolve AI (2024)
   └── Chrome Extension with AI + Snipping Tool
   └── Solve questions easily with built-in AI

⏺️ Recordscript (2024)
   └── Open-source video recorder + transcriber
   └── Built with Rust & WhisperCpp

📊 GPT Sheets Plus (2024)
   └── Formula add-on for Google Sheets
   └── Integrates Perplexity, OpenAI GPT, and more

📹 YouTube Tools (2025)
   └── Video Transcripts & Caption Plus extensions
   └── AI chat about video content

🕸️ dTON Explorer (2025)
   └── TON Blockchain Query & Data Explorer
`;
        break;

      case "contact":
        result = renderContactCommand();
        break;

      case "whoami":
        result = "guest@terrydjony:~$";
        break;

      case "date":
        result = new Date().toString();
        break;

      case "ls":
        result = `about  projects  contact`;
        break;

      case "echo":
        result = args.join(" ");
        break;

      case "clear":
        output.value = [
          {
            command: "init",
            output: `${getASCIIArt()}\nWelcome to Terry Djony's Terminal Portfolio!\nIndonesian YC W21 Alumni • Self-taught programmer • Tech Startup Entrepreneur (SaaS and AI)\nType 'help' for available commands.\n`,
            timestamp: new Date()
          },
          {
            command: "help",
            output: renderHelpCommand(),
            timestamp: new Date()
          }
        ];
        return;

      case "history":
        result = commandHistory.value
          .map((cmd: string, i: number) => `${(i + 1).toString().padStart(3)} ${cmd}`)
          .join("\n");
        break;

      case "neofetch":
        result = `                    terry-djony@indonesia
                    ----------------------
        ..          OS: Entrepreneur OS
      .::::::.      Host: YC W21 Alumni
     ::::::::::::   Location: Bandung, Indonesia
    ::::::::::::::  Uptime: ${Math.floor(Date.now() / 1000 / 60)} minutes
   ::::::::::::::::  Experience: Self-taught since age 13
  ::::::::::::::::::  Status: Building SaaS Companies
   ::::::::::::::::  Focus: AI + Customer Support
    ::::::::::::::   Products: Serving millions of users
     ::::::::::::    
      .::::::.      
        ..          `;
        break;

      default:
        if (trimmedCmd) {
          result = `Command not found: ${command}\nType 'help' for available commands.`;
        }
        break;
    }

    if (result || trimmedCmd) {
      output.value = [
        ...output.value,
        {
          command: trimmedCmd,
          output: result,
          timestamp: new Date()
        }
      ];
    }

    // Reset input and history index
    currentInput.value = "";
    historyIndex.value = -1;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(currentInput.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.min(historyIndex.value + 1, commandHistory.value.length - 1);
      if (commandHistory.value[commandHistory.value.length - 1 - newIndex]) {
        historyIndex.value = newIndex;
        currentInput.value = commandHistory.value[commandHistory.value.length - 1 - newIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex.value > 0) {
        historyIndex.value--;
        currentInput.value = commandHistory.value[commandHistory.value.length - 1 - historyIndex.value];
      } else if (historyIndex.value === 0) {
        historyIndex.value = -1;
        currentInput.value = "";
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const input = currentInput.value.toLowerCase();
      const matches = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(input));
      if (matches.length === 1) {
        currentInput.value = matches[0];
      }
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      const terminal = document.getElementById("terminal-container");
      if (terminal) {
        terminal.scrollTop = terminal.scrollHeight;
      }
    }, 10);
  };

  // Scroll to bottom when output changes
  useEffect(() => {
    scrollToBottom();
  }, [output.value]);

  return (
    <div className="terminal-container" id="terminal-container">
      <div className="terminal-header">
        <div className="terminal-buttons">
          <div className="terminal-button close"></div>
          <div className="terminal-button minimize"></div>
          <div className="terminal-button maximize"></div>
        </div>
        <div className="terminal-title">terry-djony@portfolio: ~</div>
      </div>
      
      <div className="terminal-body">
        {output.value.map((item: TerminalOutput, index: number) => (
          <div key={index} className="terminal-line">
            {item.command && item.command !== "init" && (
              <div className="command-line">
                <span className="prompt">guest@terrydjony:~$ </span>
                <span className="command">{item.command}</span>
              </div>
            )}
            {item.output && (
              <div className="output">
                {typeof item.output === "string" ? (
                  <pre>{item.output}</pre>
                ) : (
                  item.output
                )}
              </div>
            )}
          </div>
        ))}
        
        <div className="terminal-line input-line">
          <span className="prompt">guest@terrydjony:~$ </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput.value}
            onInput={(e) => currentInput.value = (e.target as HTMLInputElement).value}
            onKeyDown={handleKeyDown}
            className="terminal-input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
} 