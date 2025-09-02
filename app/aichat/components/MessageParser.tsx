import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";

// Type definitions
interface ActionProvider {
  greet: () => void;
  handleHelp: () => void;
  handleWeather: () => void;
  handleTime: () => void;
  handleThanks: () => void;
  handleTask: () => void;
  handleSchedule: () => void;
  handleMembers: () => void;
  handleDocuments: () => void;
  handleVacation: () => void;
  handleApproval: () => void;
  handleSettings: () => void;
  handleUnknown: () => void;
}

interface State {
  [key: string]: any;
}

class MessageParser {
  private actionProvider: ActionProvider;
  private state: State;

  constructor(actionProvider: ActionProvider, state: State) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message: string): void {
    const lowerCase = message.toLowerCase();

    if (lowerCase.includes("안녕") || lowerCase.includes("hello")) {
      this.actionProvider.greet();
    } else if (lowerCase.includes("도움") || lowerCase.includes("help")) {
      this.actionProvider.handleHelp();
    } else if (lowerCase.includes("날씨") || lowerCase.includes("weather")) {
      this.actionProvider.handleWeather();
    } else if (lowerCase.includes("시간") || lowerCase.includes("time")) {
      this.actionProvider.handleTime();
    } else if (lowerCase.includes("감사") || lowerCase.includes("thank")) {
      this.actionProvider.handleThanks();
    } else if (
      lowerCase.includes("작업") ||
      lowerCase.includes("task") ||
      lowerCase.includes("업무")
    ) {
      this.actionProvider.handleTask();
    } else if (
      lowerCase.includes("일정") ||
      lowerCase.includes("schedule") ||
      lowerCase.includes("캘린더")
    ) {
      this.actionProvider.handleSchedule();
    } else if (
      lowerCase.includes("직원") ||
      lowerCase.includes("member") ||
      lowerCase.includes("팀원")
    ) {
      this.actionProvider.handleMembers();
    } else if (lowerCase.includes("문서") || lowerCase.includes("document")) {
      this.actionProvider.handleDocuments();
    } else if (lowerCase.includes("휴가") || lowerCase.includes("vacation")) {
      this.actionProvider.handleVacation();
    } else if (lowerCase.includes("승인") || lowerCase.includes("approval")) {
      this.actionProvider.handleApproval();
    } else if (lowerCase.includes("설정") || lowerCase.includes("setting")) {
      this.actionProvider.handleSettings();
    } else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;
