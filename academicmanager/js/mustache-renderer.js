class MustacheRenderer {
  constructor() {
    this.templates = {};
    this.templatesLoaded = false;
     this.loadingPromise = null;
  }

 async loadAllTemplates() {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }
    
    this.loadingPromise = (async () => {
      console.log("Iniciando carga de templates...");
      const templateNames = [
        "main-interface",
        "bulk-actions",
        "selection",
        "subjects",
        "admin-panel",
        "results",
        "forms/program-form",
        "forms/subject-form",
        "forms/teacher-form",
      ];

      try {
        for (const name of templateNames) {
          const response = await fetch(
            `${moodleData.baseUrl}/local/academicmanager/templates/${name}.mustache`
          );
          if (response.ok) {
            this.templates[name] = await response.text();
            console.log(`✓ Template "${name}" cargado`);
          } else {
            console.warn(`✗ Template "${name}" no encontrado (${response.status})`);
            this.templates[name] = "";
          }
        }
        this.templatesLoaded = true;
        console.log("Todos los templates cargados:", Object.keys(this.templates));
        return true;
      } catch (error) {
        console.error("Error loading templates:", error);
        this.templatesLoaded = false;
        return false;
      }
    })();
    
    return this.loadingPromise;
  }

  // Opción 1: Hacer render() asíncrono
  async render(templateName, data, containerId) {
    // Asegurarse de que los templates estén cargados
    if (!this.templatesLoaded) {
      console.warn(`Render solicitado antes de cargar templates. Cargando ahora...`);
      const loaded = await this.loadAllTemplates();
      if (!loaded) {
        console.error("No se pudieron cargar los templates");
        return false;
      }
    }
    
    if (!this.templates[templateName]) {
      console.warn(`Template "${templateName}" no está disponible`);
      console.warn("Templates disponibles:", Object.keys(this.templates));
      return false;
    }

    try {
      const html = Mustache.render(this.templates[templateName], data);
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = html;
        return true;
      }
      console.error(`Contenedor "${containerId}" no encontrado`);
      return false;
    } catch (error) {
      console.error("Error rendering template:", error);
      return false;
    }
  }

  // También hacer los métodos específicos asíncronos
  async renderSelection(programs, semesters) {
    return await this.render("selection", { programs, semesters }, "selection-container");
  }

  async renderSubjects(subjects, programName, semester) {
    return await this.render(
      "subjects",
      {
        subjects,
        program_name: programName,
        semester,
      },
      "subjects-container"
    );
  }

  async renderAdminPanel() {
    return await this.render("admin-panel", {}, "admin-container");
  }

  async renderResults(operations) {
    return await this.render("results", { operations }, "results-container");
  }

  async renderProgramForm(programs, semesters) {
    return await this.render(
      "forms/program-form",
      { programs, semesters },
      "form-container"
    );
  }

  async renderSubjectForm(programs, semesters) {
    return await this.render(
      "forms/subject-form",
      { programs, semesters },
      "form-container"
    );
  }

  async renderTeacherForm(subjects) {
    return await this.render("forms/teacher-form", { subjects }, "form-container");
  }
}

//   render(templateName, data, containerId) {
    // if (!this.templatesLoaded) {
    //   console.error(
        // "Templates no cargados aún. Llama a loadAllTemplates() primero."
    //   );
    //   return false;
    // }
    // if (!this.templates[templateName]) {
    //   console.warn(
        // `Template "${templateName}" no está en la lista de templates cargados.`
    //   );
    //   console.warn("Templates disponibles:", Object.keys(this.templates));
    //   return false;
    // }   

    // try {
    //   const html = Mustache.render(this.templates[templateName], data);
    //   const container = document.getElementById(containerId);
    //   if (container) {
        // container.innerHTML = html;
        // return true;
    //   }
    //   return false;
    // } catch (error) {
    //   console.error("Error rendering template:", error);
    //   return false;
    // }
//   }

//   // Métodos específicos (solo llaman a render)
//   renderSelection(programs, semesters) {
    // return this.render(
    //   "selection",
    //   { programs, semesters },
    //   "selection-container"
    // );
//   }

//   renderSubjects(subjects, programName, semester) {
    // return this.render(
    //   "subjects",
    //   {
        // subjects,
        // program_name: programName,
        // semester,
    //   },
    //   "subjects-container"
    // );
//   }

//   renderAdminPanel() {
    // return this.render("admin-panel", {}, "admin-container");
//   }

//   renderResults(operations) {
    // return this.render("results", { operations }, "results-container");
//   }

//   renderProgramForm(programs, semesters) {
    // return this.render(
    //   "forms/program-form",
    //   { programs, semesters },
    //   "form-container"
    // );
//   }

//   renderSubjectForm(programs, semesters) {
    // return this.render(
    //   "forms/subject-form",
    //   { programs, semesters },
    //   "form-container"
    // );
//   }

//   renderTeacherForm(subjects) {
    // return this.render("forms/teacher-form", { subjects }, "form-container");
//   }
// }
