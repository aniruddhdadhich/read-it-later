"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { DeleteIcon } from "./DeleteIcon";
import Link from "next/link";
import Navbar from "./components/Navbar";
export default function Home() {

  return (
    <div className="min-h-screen  bg-gray-100">
       <Navbar />
    </div>
  );
}