create database if not exists dim;

create table if not exists dim.dim_permission (
  employee_code  varchar(64) comment '员工编码',
  employee_name  varchar(64) comment '员工姓名',
  sugar_email    varchar(64) comment 'Sugar BI 邮箱',
  sugar_nickname varchar(64) comment 'Sugar BI 昵称',
  primary key (employee_code)
)
comment 'Sugar BI 账号';

insert into dim.dim_permission(employee_code, employee_name, sugar_email, sugar_nickname) values ('admin', 'admin', 'admin@baidu.com', '超级管理员角色');
insert into dim.dim_permission(employee_code, employee_name, sugar_email, sugar_nickname) values ('0000000001', '员工一', 'tm@sugar.com', '人力主题查看角色');
insert into dim.dim_permission(employee_code, employee_name, sugar_email, sugar_nickname) values ('0000000002', '员工二', 'tm@sugar.com', '人力主题查看角色');
insert into dim.dim_permission(employee_code, employee_name, sugar_email, sugar_nickname) values ('0000000003', '员工三', 'tm@sugar.com', '人力主题查看角色');
insert into dim.dim_permission(employee_code, employee_name, sugar_email, sugar_nickname) values ('0000000004', '员工四', 'qa@sugar.com', '质量主题查看角色');
insert into dim.dim_permission(employee_code, employee_name, sugar_email, sugar_nickname) values ('0000000005', '员工五', 'qa@sugar.com', '质量主题查看角色');
insert into dim.dim_permission(employee_code, employee_name, sugar_email, sugar_nickname) values ('0000000006', '员工六', 'mk@sugar.com', '市场主题查看角色');
