import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { User } from "..";

@Injectable()
export class UsersService {

     /** `Subject` that saves the current state of the current user. */
    private _currentUserSource: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    constructor(
        private http: HttpClient,
    ) {
        this._getCurrentUser().pipe(
            tap(user => {
                this._currentUserSource.next(user);
            }),
        ).subscribe();
    }

    /**
     * Obtains the current user.
     * @returns an `Observable` with a `User` object which contains the user information
     */
    getCurrentUser(): Observable<User | null> {
        return this._currentUserSource.asObservable();
    }

    /**
     * Obtains the current user from the source data file.
     * @returns an `Observable` with a `User` object which contains the user information
     */
    _getCurrentUser(): Observable<User> {
        return from(fetch("/assets/data.json")).pipe(
            switchMap(response => from(response.json())),
            map(responseJson => responseJson["currentUser"]),
        );
    }
}