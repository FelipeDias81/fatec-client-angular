import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Client } from '../client';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  isEditing: boolean = false;
  formGroupClient: FormGroup;

  constructor(private clientService: ClientService,
    private formBuilder: FormBuilder) {
    this.formGroupClient = formBuilder.group({
      id: [''],
      name: [''],
      email: ['']
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClient().subscribe(
      {
        next: data => this.clients = data
      }
    );
  }

  save() {
    if (this.isEditing) {
      this.clientService.update(this.formGroupClient.value).subscribe({
        next: () => {
          this.loadClients()
          this.formGroupClient.reset()
          this.isEditing = false
        }
      })
    }
    else {
      this.clientService.save(this.formGroupClient.value).subscribe({
        next: data => {
          this.clients.push(data);
          this.formGroupClient.reset();
        }
      });
    }
  }

  clear(){
    this.formGroupClient.reset();
    this.isEditing = false;
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
}
