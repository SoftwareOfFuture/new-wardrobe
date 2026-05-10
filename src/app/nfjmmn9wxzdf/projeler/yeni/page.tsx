import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Yeni Proje</h1>
        <p className="text-muted-foreground mt-1">Yeni bir proje ekleyin</p>
      </div>
      <ProjectForm />
    </div>
  );
}
