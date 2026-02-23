import { Component, OnInit } from '@angular/core';
import { GithubRepo } from '../../models/github-repo.model';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-inscription-form',
  templateUrl: './inscription-form.component.html',
  styleUrls: ['./inscription-form.component.scss'],
})
export class InscriptionFormComponent implements OnInit {
  form!: FormGroup;
  today: Date = new Date();
  repos: GithubRepo[] = [];
  selectedRepos: GithubRepo[] = [];
  loadingRepos = false;
  reposError = '';
  reposFetched = false;
  submitted = false;
  submitError = '';
  constructor(
    private fb: FormBuilder,
    private githubService: GithubService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      ci: ['', [Validators.required, Validators.pattern(/^\d{5,15}$/)]],
      lugarExpedicion: ['', Validators.required],
      celular: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]],
      direccion: ['', Validators.required],
      githubUser: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, this.maxAgeValidator(30)]],
    });
  }
  get f() {
    return this.form.controls;
  }

  private maxAgeValidator(maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return null;

      const now = new Date();
      if (date > now) {
        return { futureDate: true };
      }
      let age = now.getFullYear() - date.getFullYear();
      const m = now.getMonth() - date.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
        age -= 1;
      }
      return age > maxAge ? { tooOld: { actual: age } } : null;
    };
  }

  buscarRepositorios(): void {
    const user = this.f['githubUser'].value?.trim();
    if (!user || this.f['githubUser'].invalid) {
      this.f['githubUser'].markAsTouched();
      return;
    }
    this.loadingRepos = true;
    this.reposError = '';
    this.repos = [];
    this.reposFetched = false;
    this.selectedRepos = [];

    this.githubService.getPublicRepos(user).subscribe({
      next: (repos) => {
        this.repos = repos;
        this.reposFetched = true;
        this.loadingRepos = false;
        if (repos.length === 0) {
          this.reposError = 'Este usuario no tiene repositorios públicos.';
        }
      },
      error: (err) => {
        this.reposError = err.message;
        this.loadingRepos = false;
        this.reposFetched = true;
      },
    });
  }

  onSelectionChange(repos: GithubRepo[]): void {
    this.selectedRepos = repos;
  }

  isFormValid(): boolean {
    return (
      this.form.valid &&
      this.reposFetched &&
      this.repos.length > 0 &&
      this.selectedRepos.length > 0 &&
      this.selectedRepos.length <= 2
    );
  }

  onSubmit(): void {
    this.submitted = true;
    this.submitError = '';

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      this.submitError = 'Por favor corrige los errores antes de continuar.';
      return;
    }
    if (!this.reposFetched || this.repos.length === 0) {
      this.submitError =
        'Debes buscar y tener al menos 1 repositorio público en GitHub.';
      return;
    }
    if (this.selectedRepos.length === 0) {
      this.submitError = 'Debes seleccionar al menos 1 repositorio.';
      return;
    }

    const value = this.form.value;

    const subject = encodeURIComponent(
      `Postulación Hackathon  - ${value.nombres} ${value.apellidos}`,
    );
    const body = encodeURIComponent(
      `POSTULACIÓN - HACKATHON VIRTUAL

DATOS PERSONALES
Nombres: ${value.nombres}
Apellidos: ${value.apellidos}
C.I.: ${value.ci} - ${value.lugarExpedicion}
Celular: ${value.celular}
Dirección: ${value.direccion}
Fecha de nacimiento: ${value.fechaNacimiento}
Usuario GitHub: ${value.githubUser}

REPOSITORIOS SELECCIONADOS
${this.selectedRepos.map((repos, i) => `${i + 1}. ${repos.name} - ${repos.html_url}`).join('\n')}`,
    );

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
}
