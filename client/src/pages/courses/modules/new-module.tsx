import { createOrUpdateModule, getAllModules } from "@/api/course.api";
import Breadcrumb from "@/components/bread-crumb";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Title from "@/components/ui/title";
import { handleFileChange } from "@/helpers/file-upload";
import { ModuleTypes } from "@/helpers/types";
import { useFetchAndDispatch } from "@/helpers/useFetch";
import { useCourse } from "@/stores/CourseContext";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ModulePage = () => {
  const { moduleId } = useParams();
  const { modules } = useCourse();
  useFetchAndDispatch(getAllModules, "SET_MODULES");

  const [module, setModule] = useState<ModuleTypes>({
    _id: "",
    title: "",
    description: "",
    courseId: moduleId,
    cover: "",
  });
  const navigate = useNavigate();

  const item = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(item.search);
    const myParamValue = searchParams.get("");
    if (myParamValue) {
      const items = modules.find((x) => x?._id === myParamValue);
      if (!items) return;

      setModule(items);
    }
  }, [modules, item.search]);

  const formFields = [
    { name: "title", label: "Title", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "cover", label: "Banner", type: "file" },
  ];

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setModule((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createOrUpdateModule(module);
    if (res) {
      toast.success("Success");
      navigate(-1);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createOrUpdateModule({ ...module, isDeleted: true });
    if (res) {
      toast.success("Success");
      navigate(-1);
    }
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Section", href: `/moduleId?=${moduleId}` },
    { label: module?._id === "" ? "New" : "Edit", isCurrentPage: true },
  ];

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedUrl = await handleFileChange(e);
    if (uploadedUrl) {
      setModule((prevFormData) => ({
        ...prevFormData,
        [e.target.name]: uploadedUrl,
      }));
    }
  };

  return (
    <Container>
      <Title text="Section" />
      <Breadcrumb items={breadcrumbItems} />

      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        {formFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <Textarea
                placeholder="Type your message here."
                name={field.name}
                value={module[field.name as keyof ModuleTypes] as string}
                onChange={handleInputChange}
                rows={4}
                required
              />
            ) : (
              <Input
                type={field.type}
                name={field.name}
                value={
                  field.type === "file"
                    ? undefined
                    : (module[field.name as keyof ModuleTypes] as string)
                }
                onChange={
                  field.type === "file" ? onFileUpload : handleInputChange
                }
              />
            )}
          </div>
        ))}

        {module.cover && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Current Banner
            </label>
            <a href={module.cover} target="_blank" rel="noopener noreferrer">
              <img
                src={module.cover}
                alt="Course Cover"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            </a>
          </div>
        )}

        <div className="flex items-center justify-between w-full">
          <div className="m-0">
            <Button type="submit">Add Section</Button>
            <Button
              variant="destructive"
              type="button"
              className="ml-2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" type="button" className="m-0">
                Delete Section
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this section.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Container>
  );
};

export default ModulePage;
