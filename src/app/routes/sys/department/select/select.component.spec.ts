import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SysDepartmentSelectComponent } from './select.component';

describe('SysDepartmentComponent', () => {
  let component: SysDepartmentSelectComponent;
  let fixture: ComponentFixture<SysDepartmentSelectComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SysDepartmentSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SysDepartmentSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
