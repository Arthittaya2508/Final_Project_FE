import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";

interface ModalAuthProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalAuth: React.FC<ModalAuthProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent, type: "signin" | "signup") => {
    e.preventDefault();
    if (type === "signin") {
      console.log("Sign In Data:", formData);
    } else {
      console.log("Sign Up Data:", formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <h2 className="text-center text-2xl font-bold">Welcome!</h2>
        <p className="text-center text-gray-500 mb-4">
          Please sign in or create a new account.
        </p>

        <Tabs defaultValue="signin" className="mt-4">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={(e) => handleSubmit(e, "signin")}>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="mb-3"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="mb-4"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={(e) => handleSubmit(e, "signup")}>
              <Input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="mb-3"
                required
                value={formData.fullName}
                onChange={handleChange}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                className="mb-3"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="mb-4"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Sign Up
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ModalAuth;
