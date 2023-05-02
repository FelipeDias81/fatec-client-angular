import { Component, OnInit } from '@angular/core';
import { ClientService } from '../client.service';
import { Client } from '../client';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  
  constructor(private clientService: ClientService) { }

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
}
