import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Client } from '../client';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  isEditing: boolean = false;
  formGroupClient: FormGroup;
  submitted: boolean = false;

  constructor(private clientService: ClientService,
    private formBuilder: FormBuilder) {
    this.formGroupClient = formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe(
      {
        next: data => this.clients = data
      }
    );
  }

  save() {
    this.submitted = true;

    if (this.formGroupClient.valid) {
      if (this.isEditing) {
        this.clientService.update(this.formGroupClient.value).subscribe({
          next: () => {
            this.loadClients();
            this.formGroupClient.reset();
            this.isEditing = false;
            this.submitted = false;
          }
        })
      }
      else {
        this.clientService.save(this.formGroupClient.value).subscribe({
          next: data => {
            this.clients.push(data);
            this.formGroupClient.reset();
            this.submitted = false;
          }
        });
      }
    }
  }

  clear() {
    this.formGroupClient.reset();
    this.isEditing = false;
    this.submitted = false;
  }

  edit(client: Client) {
    this.isEditing = true;
    this.formGroupClient.setValue(client);
    this.clientService.update(client).subscribe({
      next: () => this.loadClients()
    })
  }

  delete(client: Client) {
    this.clientService.delete(client).subscribe({
      next: () => this.loadClients()
    })
  }

  get name(): any {
    return this.formGroupClient.get("name");
  }
  get email(): any {
    return this.formGroupClient.get("email");
  }
}
