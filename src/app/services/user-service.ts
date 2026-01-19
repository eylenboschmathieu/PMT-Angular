import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, ObjectUnsubscribedError, Observable, of, tap } from 'rxjs';
import { Role } from './role-service';
import { environment } from '../../environments/environment';

export class NewUserDTO {
    public Email: string = null!;
    public Roles: Array<number> = null!;
}

export class UserDTO {  // Basic info about a user
    public id!: number
    public name!: string
    public email!: string
    public active!: boolean
}

export class UserDataDTO {  // All data of a user
    public id!: number
    public name!: string
    public email!: string
    public active!: boolean
    public createdBy!: string
    public roles!: Role[]
}

export class UpdateUserDTO {
    public id!: number
    public name!: string
    public active!: boolean
    public roles!: number[]  // List of role id's
}

export class UserSelectDTO { // Basic list of usernames with their internal id
    public id!: number
    public name!: string
    public icon!: string
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private http: HttpClient) { }

    url: string = environment.ENDPOINT_URI;

    all(): Observable<UserDTO[]> {  // Returns { Id, Name, Email, Active }*
        return this.http.get<UserDTO[]>(this.url + "/users").pipe(
            tap(req => console.log(req)),
            catchError(this.handleError("all", []))
        );
    }

    get(userId: number): Observable<UserDataDTO> {
        return this.http.get<UserDataDTO>(this.url + "/user/" + userId).pipe(
            tap(req => console.log(req)),
            catchError(this.handleError("get", new UserDataDTO()))
        );
    }

    list(): Observable<UserSelectDTO[]> {  // Response returns { Id, Name, Icon }* // Mainly used to fill <select> menus
        return this.http.get<UserSelectDTO[]>(this.url + "/users/select").pipe(
            tap(req => console.log(req)),
            catchError(this.handleError("select", []))
        );
    }

    new(user: NewUserDTO): Observable<void> {
        return this.http.post<void>(this.url + "/user/new", user).pipe(
            catchError(this.handleError("new", void 0))
        );
    }

    demo_new(user: NewUserDTO): Observable<void> {
        return this.http.post<void>(this.url + "/user/demo_new", user).pipe(
            catchError(this.handleError("demo_new", void 0))
        );
    }

    update(user: UpdateUserDTO): Observable<boolean> {
        return this.http.patch<boolean>(this.url + "/user/update/" + user.id, user).pipe(
            catchError(this.handleError("update", false))
        );
    }

    handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            console.log(operation, error);
            return of(result as T);
        }
    }
}